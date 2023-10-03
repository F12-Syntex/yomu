//TODO - Handle expired tokens
//TODO - Handle no internet connection
//TODO - make a json file for the user to store their data


// Import required modules
const http = require('http');
const https = require('https');
const cheerio = require('cheerio');
const Client = require("@xhayper/discord-rpc");
const express = require('express');

const fs = require('fs');
const os = require('os');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const SourceTextModule = require('vm');
const { noDeprecation } = require('process');
const { Console, profile } = require('console');
const fetch = require('node-fetch');


// Set up the server
let fileDir = path.join(os.homedir(), 'Yomu');
let yomuData = path.join(fileDir, 'yomu.json');

verifyYomuDir();

let hostname = 'localhost';
let port = `3023`;

let url = `http://${hostname}:${port}`;
let client_secret = 'FJk5txBuV96oBr04x0vwFF9rOTBd7JHnfY4e7M3R';
let clientId = '13194';

// let authCode = '';
let userId = '';

const app = express();
app.use(cors());

console.log('Server running at http://${hostname}:${port}/');

app.get('/callback', (req, res) => {

  const { code } = req.query;
  res.end('Authroized! you can go back to the app now.');

  if(profileExistByAuthCode(code)){
    return;
  }

  createProfileAndSetDefault();

  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  data.userprofiles.profiles[getActiveProfileKey()].authcode = code;
  saveYomuData(data);

  const authKeyUri = "http://localhost:" + port + "/authenticate";

  // console.log("loading: " + authKeyUri);
  axios.get(authKeyUri)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    console.error(error);
  });

});     

app.get('/authorise', (req, res) => {
  res.end('Authroized! you can go back to the app now.');
  console.log("called1");
});

app.get('/authenticate', (req, res) => {

    const profile = getActiveProfile();


    // console.log(profile)
    // console.log("auth code: " + profile.authcode);
    // console.log("auth key: " + profile.authkey);

    if(profile.authkey != undefined && profile.authkey != null) {
      res.end(profile.authkey);
      console.log("auth key: " + profile.authkey + " DEFINED");
      userId = profile.userInformation.id;
      return;
    }

    createAuthKey(profile, res);

});

app.get('/updatePrimaryProfile', (req, res) => {
  const profile = req.query.profile;

  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  data.userprofiles.active_profile = profile;
  saveYomuData(data);

  userId =  data.userprofiles.profiles[profile].userInformation.id;

  res.end("success");
})

app.get('/removeProfile', (req, res) => {
  const profile = req.query.profile;

  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  delete data.userprofiles.profiles[profile]; // Remove the key from the object
  
  //set the new active profile
  const keys = Object.keys(data.userprofiles.profiles);
  if(keys.length > 0){
    data.userprofiles.active_profile = keys[0];
  }
  
  saveYomuData(data);

  userId =  data.userprofiles.profiles[profile]?.userInformation.id || null; // Update your logic accordingly

  res.end("success");
});



async function createAuthKey(profile, res){

  const code = profile.authcode;

  console.log("code: " + code);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      'grant_type': 'authorization_code',
      'client_id': clientId,
      'client_secret': client_secret,
      'redirect_uri': "http://localhost:3023/callback", 
      'code': code,
    })
  };

  await fetch('https://anilist.co/api/v2/oauth/token', options)
    .then(response => {
      return response.json();
    })
    .then(data => {

      console.log("MODIFYING DATA: " + data.access_token);
      profile.authkey = data.access_token;
      profile.refresh_token = data.refresh_token;

      //get user data from the endpoint getStatisticsBasic
      const apiCall = "http://localhost:" + port + "/getStatisticsBasic";
      axios.get(apiCall).then(response => {
        profile.userInformation = response.data.data.Viewer;
        if(profile.userInformation.name == "syntexdev3"){
          profile.accountInformation.nsfw = true;
        }
        const data2 = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
        data2.userprofiles.profiles[getActiveProfileKey()] = profile;
        saveYomuData(data2);
      });

      const data2 = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
      data2.userprofiles.profiles[getActiveProfileKey()] = profile;
      saveYomuData(data2);

      res.end(profile.authcode);
    })
    .catch(error => {
      console.log("error: " + error);
      console.error(error);
    });
}



app.get('/isConnected', (req, res) => { 
  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  const profiles = data.userprofiles.profiles;
  const keys = Object.keys(profiles);

  let value = false;

  if(keys.length > 0){
    for(let i = 0; i < keys.length; i++){
      if(profiles[keys[i]].authkey !== undefined && profiles[keys[i]].authkey !== null){
        value = true;
      }
    }
  }

  console.log("is connected: " + value);

  res.end(value+"");
});

function verifyYomuDir() {
  const profile = getRandomString();

  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }

  if (!fs.existsSync(yomuData)) {
    const rprofile = getRandomString();
    const data = {
      userprofiles: {
        active_profile: null,
        profiles: {
          // [rprofile]: {
          //   display: "false",
          //   authcode: null,
          //   authkey: null,
          //   userInformation: {
          //     id: null,
          //     name: null,
          //     avatar: null,
          //   }
          // }
        }
       }
    };

    fs.writeFileSync(yomuData, JSON.stringify(data));
  }else{
    console.log("yomu data exists");
  }
} 

function profileExistByAuthCode(code){
  console.log("checking if profile exist by auth code");

  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  const profiles = data.userprofiles.profiles;
  const keys = Object.keys(profiles);
  
  for(let i = 0; i < keys.length; i++){
    if(profiles[keys[i]].authcode == code){
      console.log("profile exist by auth code");
      return true;
    }
  }

  console.log("profile does not exist by auth code");
  return false;
}

function getActiveProfileKey() {
  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  return data.userprofiles.active_profile;
}

function getActiveProfile() {
  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  const activeProfile = data.userprofiles.active_profile;
  return data.userprofiles.profiles[activeProfile];
}

function enableViewForProfile() {
  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  const activeProfile = data.userprofiles.active_profile;
  data.userprofiles.profiles[activeProfile].display = "true";
  fs.writeFileSync(yomuData, JSON.stringify(data));
}

function getProfiles() {
  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  return data.userprofiles.profiles;
}

function removeUserIfExists(userName){
    const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
    const profiles = data.userprofiles.profiles;
    const keys = Object.keys(profiles);
    let occurence = 0;
    for(let i in keys){
      console.log("name: " + profiles[keys[i]].userInformation.name);
      if(profiles[keys[i]].userInformation.name == userName){
        occurence++;
        console.log("occurence: " + occurence, "name: " + userName);
      }
      if(occurence > 1){
        delete profiles[keys[i]];
        fs.writeFileSync(yomuData, JSON.stringify(data));
        return true;
      }
    }
    return false;
}

function saveYomuData(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(yomuData, jsonData);
  console.log("saved yomu data");
}

function createProfileAndSetDefault() {

  // [rprofile]: {
  //   display: "false",
  //   authcode: null,
  //   authkey: null,
  //   userInformation: {
  //     id: null,
  //     name: null,
  //     avatar: null,
  //   }
  // }

  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  const profile = getRandomString();
  data.userprofiles.profiles[profile] = {
    authcode: null,
    authkey: null,
    userInformation: {
      id: -1,
      name: [profile],
      avatar: {
        large: "https://avatarfiles.alphacoders.com/896/thumb-89615.png"
      },
      bannerImage: "",
    },
    accountInformation: {
      nsfw: false,
    }
  };  

  data.userprofiles.active_profile = profile;

  // Convert the data object to JSON with indentation
  const jsonData = JSON.stringify(data, null, 2);

  // Write the JSON data to a file
  fs.writeFileSync(yomuData, jsonData);
}

app.get('/getUserProfiles', (req, res) => {
  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  res.send(data);
});

app.get('/getUserProfile', (req, res) => {
  const data = JSON.parse(fs.readFileSync(yomuData, 'utf8'));
  res.send(data.userprofiles.profiles[getActiveProfileKey()]);
});

//end

app.get('/updateEpisodeForUser', (req, res) => {
  const animeId = req.query.animeId;
  const episode = req.query.episode;
  const authkey = req.query.authkey;
  
  // make API call to AniList
  axios.post('https://graphql.anilist.co', {
    query: `
      mutation ($mediaId: Int!, $progress: Int!) {
        SaveMediaListEntry(mediaId: $mediaId, progress: $progress) {
          id
        }
      }
    `,
    variables: {
      mediaId: animeId,
      progress: episode
    }
  }, {
    headers: {
      'Authorization': `Bearer ${authkey}`
    }
  })
  .then(response => {
    console.log(response.data);
    res.send('Anime updated successfully');
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error updating anime');
  });

});

app.get('/updateChapterForUser', (req, res) => {
  const mangaId = req.query.mangaId;
  const chapter = req.query.chapter;
  const authkey = req.query.authkey;

  // make API call to AniList
  axios.post('https://graphql.anilist.co', {
    query: `
      mutation ($mediaId: Int!, $progress: Int!) {
        SaveMediaListEntry(mediaId: $mediaId, progress: $progress) {
          id
        }
      }
    `,
    variables: {
      mediaId: mangaId,
      progress: chapter
    }
  }, {
    headers: {
      'Authorization': `Bearer ${authkey}`
    }
  })
  .then(response => {
    console.log(response.data);
    res.send('Manga updated successfully');
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error updating manga');
  });
});


app.get('/getStatisticsBasic', (req, res) => {

const query = `
  query {
    Viewer {
      id,
      name,
      avatar{
        large
      },
      bannerImage,
    }
  }
`;

  const response = anilistQuery(query);

  response.then(data => {
    res.end(JSON.stringify(data));
  });

});


app.get('/getStatistics', (req, res) => {
  const query = `
    query {
      Viewer {
        name,
        avatar{
          large
        },
        bannerImage,
        statistics {
          anime {
            count
            meanScore
            standardDeviation
            minutesWatched
            episodesWatched
            chaptersRead
            volumesRead
            formats(limit: 10) {
              format
              count
            }
            statuses(limit: 10) {
              status
              count
            }
            scores(limit: 10) {
              score
              count
            }
            lengths(limit: 10) {
              length
              count
            }
            genres(limit: 10) {
              genre
              count
            }
            tags(limit: 10) {
              tag {
                name
                description
              }
              count
            }
            countries(limit: 10) {
              country
              count
            }
            voiceActors(limit: 10) {
              voiceActor {
                id
                name {
                  full
                  native
                }
              }
              count
            }
            staff(limit: 10) {
              staff {
                id
                name {
                  full
                  native
                }
              }
              count
            }
            studios(limit: 10) {
              studio {
                id
                name
              }
              count
            }
          }
        }
      }
    }
  `;
  const response = anilistQuery(query);

  response.then(data => {
    res.end(JSON.stringify(data));
  });

});

app.get('/fetchList', (req, res) => {

  const status = req.query.status;
  const media = req.query.media;

  console.log("status: " + status);
  console.log("media: " + media);

  let query = "";

  if(media == "ANIME"){
    query = `
    query {
      MediaListCollection(userId: ${userId}, type: ${media}, status: ${status}) {
        lists {
          entries {
            progress,
            media {
              id
              title {
                romaji
                english
                native
              }
              description
              coverImage {
                extraLarge
                color
              }
              bannerImage
              status
              season
              episodes
              duration
              averageScore
              genres
              synonyms
              format
              source
            }
          }
        }
      }
    }
    `;
  }else if(media == "MANGA"){
    query = `
    query {
      MediaListCollection(userId: ${userId}, type: ${media}, status: ${status}) {
        lists {
          entries {
            progress,
            media {
              id
              title {
                romaji
                english
                native
              }
              description
              coverImage {
                extraLarge
                color
              }
              bannerImage
              status
              chapters
              volumes
              averageScore
              genres
              synonyms
              format
              source
            }
          }
        }
      }
    }
    `;
  }
  

  const response = anilistQuery(query);
  response.then(data => {
    res.end(JSON.stringify(data));
  });
});

app.get('/getCurrentWatchingList', (req, res) => {
  const query = `
  query {
    MediaListCollection(userId: ${userId}, type: ANIME, status: CURRENT) {
      lists {
        entries {
          progress,
          media {
            id
            title {
              romaji
              english
              native
            }
            description
            coverImage {
              extraLarge
              color
            }
            bannerImage
            status
            season
            episodes
            duration
            averageScore
            genres
            synonyms
            format
            source
          }
        }
      }
    }
  }
  `;

  const response = anilistQuery(query);
  response.then(data => {
    res.end(JSON.stringify(data));
  });
});

app.get('/getPlanningList', (req, res) => {
  const query = `
  query {
    MediaListCollection(userId: ${userId}, type: ANIME, status: PLANNING) {
      lists {
        entries {
          progress,
          media {
            id
            title {
              romaji
              english
              native
            }
            description
            coverImage {
              extraLarge
              color
            }
            bannerImage
            status
            season
            episodes
            duration
            averageScore
            genres
            synonyms
            format
            source
          }
        }
      }
    }
  }
  `;

  const response = anilistQuery(query);
  response.then(data => {
    res.end(JSON.stringify(data));
  });
});

app.get('/getHot', (req, res) => {

  let suffix = "false";
  const profile = getActiveProfile();
  if(profile.accountInformation.nsfw == true){
    suffix = "true";
  }



  const sort = req.query.sort;
  const type = req.query.type;
  
  const query = `
        query {
          Page (page: 1, perPage: 10) {
            pageInfo {
              total
              currentPage
              lastPage
              hasNextPage
              perPage
            }
            media (type: ANIME, sort: ${sort}, isAdult: ${suffix}, format: ${type}) {
              id
              title {
                romaji
                english
                native
              }
              description
              coverImage {
                extraLarge
                color
              }
              bannerImage
              status
              isAdult
              season
              episodes
              duration
              averageScore
              genres
              synonyms
              format
              source
              studios(isMain: true) {
                nodes {
                  name
                }
              }
              staff {
                edges {
                  role
                  node {
                    name {
                      full
                    }
                  }
                }
              }
              relations {
                edges {
                  relationType
                  node {
                    id
                    title {
                      romaji
                      english
                      native
                    }
                    description
                    coverImage {
                      extraLarge
                      color
                    }
                    bannerImage
                    status
                    season
                    episodes
                    duration
                    averageScore
                    genres
                    synonyms
                    format
                    source
                    studios(isMain: true) {
                      nodes {
                        name
                      }
                    }
                    staff {
                      edges {
                        role
                        node {
                          name {
                            full
                          }
                        }
                      }
                    }
                  }
                }
              }
              streamingEpisodes {
                title
                thumbnail
                url
                site
              }
              nextAiringEpisode {
                airingAt
                timeUntilAiring
                episode
              }
            }
          }
        }
      `;

  const response = anilistQuery(query);
  response.then(data => {
    res.end(JSON.stringify(data));
  });
});

async function anilistQuery(query){

  const authKey = getActiveProfile().authkey;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authKey}`
    },
    body: JSON.stringify({ query })
  })
  .then(res => res.json())
  .then(data => {
    return data;
  })
  .catch(err => console.error(err));
  
  return response;
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//http://localhost:3023/search?data=hello%20world
app.get('/auth', (req, res) => {
  const { client_id, redirect_uri, response_type } = req.query;
});

app.get('/searchContent', (req, res) => {
  console.log("searching for content: " + req.query.query);
  const search = req.query.query;

  const season = req.query.season;
  const format = req.query.format;
  const status = req.query.status;
  const sort = req.query.sort;
  const nsfw = req.query.nsfw;
  const items_select = req.query.items_select;
  const minimumTagRank = req.query.minimumTagRank;

  const page = req.query.page;
  
  let tags = req.query.tags;

  let param = "";

  let cpage = 1

  if(search != ""){
    param += "search: \"" + search + "\", ";
  }

  if(season != "Any"){
    param += "season: " + season.toUpperCase().replaceAll(" ", "_") + ", ";
  }

  if(format != "Any"){
    param += "format: " + format.toUpperCase().replaceAll(" ", "_") + ", ";
  }

  if(status != "Any"){
    param += "status: " + status.toUpperCase().replaceAll(" ", "_") + ", ";
  }

  if(sort != "None"){
    param += "sort: " + sort.toUpperCase().replaceAll(" ", "_") + ", ";
  }

  if(page != "" && page != undefined){
    cpage = page;
  }

  if(tags != "" && tags != undefined && tags != "Anime"){
    param += "tag_in: [";
    tags += ","
    let tagList = tags.split(",");
    for(const tag of tagList){
      const tagTrimmed = tag.trim();
      if(tagTrimmed != "" && tagTrimmed != undefined && tagTrimmed != "Anime"){
        param += "\"" + tagTrimmed + "\", ";
      }
    }
    if(param != ""){
      param = param.substring(0, param.length - 2);
    }
    param += "], ";
  }

  if(nsfw != "Any"){
    if(nsfw == "SFW"){
      param += "isAdult: false, ";
    }else if(nsfw == "NSFW"){
      param += "isAdult: true, ";
    }
  }

  if(minimumTagRank != "" && minimumTagRank != undefined){
    param += "minimumTagRank: " + minimumTagRank + ", ";
  }

  if(param != ""){
    param = param.substring(0, param.length - 2);
  }
  
  console.log("param: " + param);

  //search: "${search}", type: ANIME)

  const query = `
      query {
        Page (page: ${cpage}, perPage: ${items_select}) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          } 
          media (${param}, type: ANIME) {
            id
            episodes
            averageScore
            title {
              romaji
              english
              native
            }
            description
            coverImage {
              extraLarge
              color
            }
          }
        }
      }
    `;
  const response = anilistQuery(query);

  response.then(data => {
    console.log("response: " + JSON.stringify(data));
    res.end(JSON.stringify(data));
  });

});


function saveData(code, filePath) {
  const fileDir = path.dirname(filePath);

  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
  }

  fs.writeFile(filePath, code, (err) => {
    if (err) throw err;
    console.log('Code saved to file: ' + filePath);
  });
}

function getRandomString() {
  var length = 12;
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

