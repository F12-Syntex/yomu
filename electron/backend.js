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
const { Console } = require('console');



// Set up the server
let fileDir = path.join(os.homedir(), 'Yomu');

const AUTH_CODE = path.join(fileDir, 'authCode.txt');
const AUTH_KEY = path.join(fileDir, 'authKey.txt');
const USER_DATA = path.join(fileDir, 'userInformation.txt');

let hostname = 'localhost';
let port = `3023`;

let url = `http://${hostname}:${port}`;
let client_secret = 'FJk5txBuV96oBr04x0vwFF9rOTBd7JHnfY4e7M3R';
let clientId = '13194';

let authCode = '';
let userId = '';

const app = express();
app.use(cors());

console.log('Server running at http://${hostname}:${port}/');

//http://localhost:3023/search?data=hello%20world
app.get('/callback', (req, res) => {
  const { code } = req.query;
  res.end('Authroized! you can go back to the app now.');

  console.log("saving code to file: " + AUTH_CODE);
  saveData(code, AUTH_CODE);

  const authKeyUri = "http://localhost:" + port + "/authenticate";

  console.log("loading: " + authKeyUri);
  axios.get(authKeyUri)
  .then(response => {
    console.log("authCode: " + response.data);
    return response.data;
  })
  .catch(error => {
    console.error(error);
  });

});


app.get('/getStats', (req, res) => {
});

app.get('/isConnected', (req, res) => { 
  if(fs.existsSync(AUTH_KEY)) {
    res.end("true");
    return;
  }else{
    res.end("false");
    return;
  }
});

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

app.get('/getStatistics', (req, res) => {
  const authKey = req.query.authkey;
  const userIdentification = userId; 

  const query = `
  query {
    Viewer {
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



app.get('/getCurrentWatchingList', (req, res) => {
  const query = `
  query {
    MediaListCollection(userId: ${userId}, type: ANIME, status: CURRENT) {
      lists {
        entries {
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

async function anilistQuery(query){

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authCode}`
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

app.get('/authenticate', (req, res) => {

  if(authCode != '') {
    console.log("cached");
    res.end(authCode);
    return;
  }

    try{


      
      if(fs.existsSync(AUTH_KEY)) {
        authCode = fs.readFileSync(AUTH_KEY, 'utf8').trim();
        userId = fs.readFileSync(USER_DATA, 'utf8').trim();
        res.end(authCode);
        return;
      }
      createAuthKey(AUTH_CODE, res);


    } catch (err) {
      createAuthKey(AUTH_CODE, res);
      console.error(err);
    }
  });

  async function saveUserData(){

    console.log("saving user data to file: " + USER_DATA);

    const userIdQuery = `
    query {
      Viewer {
        id
      }
    }
    `;

    const id = await anilistQuery(userIdQuery);
    userId = id.data.Viewer.id;

    fs.writeFile(USER_DATA, id.data.Viewer.id+"", (err) => {
      if (err) throw err;
      console.log(USER_DATA + ' has been saved!');
    });
  }

  async function createAuthKey(filePath, res, err){

    const code = fs.readFileSync(filePath, 'utf8').trim();

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
        console.log(data);

        authCode = data.access_token;
        saveData(data.refresh_token, AUTH_CODE);
        saveData(data.access_token, AUTH_KEY);
        res.end(authCode); // Move this line here
      })
      .catch(error => {
        console.log("error: " + error);
        console.error(error);
      });

      saveUserData();
  }

  


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//http://localhost:3023/search?data=hello%20world
app.get('/auth', (req, res) => {
  const { client_id, redirect_uri, response_type } = req.query;
});


function saveData(code, filePath) {

  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
  }

  fs.writeFile(filePath, code, (err) => {
    if (err) throw err;
    console.log('Code saved to file: ' + filePath);
  });
}

