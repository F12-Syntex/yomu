//TODO: make custom user profiles


import axios from "axios";
// import { json } from "express";

export type Anime = {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  coverImage: {
    extraLarge: string;
    color: string;
  };
  bannerImage: string;
  status: string;
  season: string;
  episodes: number;
  duration: number;
  progress: number;
  averageScore: number;
  isAdult: boolean;
  genres: string[];
  synonyms: string[];
  format: string;
  source: string;
  studios: {
    nodes: {
      name: string;
    }[];
  };
  staff: {
    edges: {
      role: string;
      node: {
        name: {
          full: string;
        };
      };
    }[];
  };
  relations: {
    edges: {
      relationType: string;
      node: Anime;
    }[];
  };
  streamingEpisodes: {
    title: string;
    thumbnail: string;
    url: string;
    site: string;
  }[];
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
  trailer?: {
    id: string;
    site: string;
    thumbnail: string;
  };
};

export type AnimeFormat = {
  format: string;
  count: number;
}

export type AnimeStatus = {
  status: string;
  count: number;
}

export type AnimeLength= {
  length: string;
  count: number;
}

export type AnimeGenre = {
  genre: string;
  count: number;
}

export type AnimeTag = {
  tag: {
    name: string;
    description: string;
  };
  count: number;
}

export type AnimeCountry = {
  country: string;
  count: number;
}

export type VoiceActor = {
  voiceActor: {
    id: number;
    name: {
      full: string;
      native: string;
    };
  };
  count: number;
}

export type Staff = {
  staff: {
    id: number;
    name: {
      full: string;
      native: string;
    };
  };
  count: number;
}

export type Studio = {
  studio: {
    id: number;
    name: string;
  };
  count: number;
}

export type AnilistMedia = {
  id: number;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  description?: string;
  coverImage?: {
    extraLarge?: string;
    color?: string;
  };
}

export type AnilistResponse = {
  data: {
    Page: {
      media: AnilistMedia[];
    };
  };
}

export type AnimeStatistics = {
  count: number;
  meanScore: number;
  standardDeviation: number;
  minutesWatched: number;
  episodesWatched: number;
  chaptersRead: number;
  volumesRead: number;
  formats: AnimeFormat[];
  statuses: AnimeStatus[];
  scores: any[]; // Since the "scores" field is empty in the provided JSON, its type is not clear.
  lengths: AnimeLength[];
  genres: AnimeGenre[];
  tags: AnimeTag[];
  countries: AnimeCountry[];
  voiceActors: VoiceActor[];
  staff: Staff[];
  studios: Studio[];
}

export type UserStatistics = {
  anime: AnimeStatistics;
}

export type UserDataType = {
  data: {
    User: {
      statistics: UserStatistics;
    };
  };
}

export type Manga = {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  description: string | null;
  coverImage: {
    extraLarge: string;
    color: string | null;
  };
  bannerImage: string | null;
  status: string | null;
  isAdult: boolean;
  genres: string[];
  synonyms: string[];
  format: string | null;
  source: string | null;
  authors: {
    nodes: {
      name: string;
    }[];
  };
  serialization: {
    nodes: {
      name: string;
    }[];
  };
  chapters: number;
  volumes: number | null;
  averageScore: number | null;
  relationChapters: number | null;
  relatedMedia: {
    edges: {
      relationType: string;
      node: Manga;
    }[];
  };
};

export type AnimeQuery = {
  id: number;
  progress: number;
  episodes: number;
  averageScore: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  coverImage: {
    extraLarge: string;
    color: string;
  };
};

/*
  This function will update the episode for the user in the database
  @param props: Anime
  @param episode: number - the episode the user is on
*/
export function updateEpisodeForUser(id: string, episode: string) {
  const port = `3023`;
  const authKeyUri = "http://localhost:" + port + "/authenticate";

  // Get authentication key from server
  axios.get(authKeyUri)
    .then(response => {
      const authKey = response.data;
      const uri = "http://localhost:" + port + `/updateEpisodeForUser?animeId=${id}&episode=${episode}&authkey=${authKey}`;
      axios.get(uri);
    })
    .catch(error => {
      console.error(error);
    });
}

export function updateChapterForUser(props: Manga, chapter: string) {
  const port = `3023`;
  const authKeyUri = "http://localhost:" + port + "/authenticate";

  // Get authentication key from server
  axios.get(authKeyUri)
    .then(response => {
      const authKey = response.data;
      const uri = "http://localhost:" + port + `/updateChapterForUser?mangaId=${props.id}&chapter=${chapter}&authkey=${authKey}`;
      axios.get(uri);
    })
    .catch(error => {
      console.error(error);
    });
}

export async function getUserStatistics(){
  const port = `3023`;
  const authKeyUri = "http://localhost:" + port + "/authenticate";

  // Get authentication key from server

  const key = await axios.get(authKeyUri);
  const authKey = key.data;

  console.log("authkey: " + authKey);
  const uri = "http://localhost:" + port + `/getStatistics?&authkey=${authKey}`;
  
  const data = await axios.get(uri);
  return data.data;
}

export async function getTrendingAnime(): Promise<AnimeQuery[]> {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      query: `
        query {
          Page (page: 1, perPage: 20) {
            pageInfo {
              total
              currentPage
              lastPage
              hasNextPage
              perPage
            }
            media (type: ANIME, sort: TRENDING_DESC) {
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
            }
          }
        }
      `
    })
  });

  const data = await response.json();

  return data.data.Page.media.map((anime: any) => ({
    id: anime.id,
    title: anime.title,
    description: anime.description,
    coverImage: anime.coverImage
  }));
}

export async function getTrendingAnimeDeep(sort: string, type: string): Promise<any[]> {
  const port = `3023`;

  const uri = "http://localhost:" + port + `/getHot?&sort=${sort}&type=${type}`;  
  const data = await axios.get(uri);
  return data.data;
}

export function changeRootBackground(img: string) {
  const root = document.querySelector(':root');

  if(root == null){
    console.log("root is null");
    return;
  }

  const pseudoElement = document.createElement('div');
  pseudoElement.style.content = '""';
  pseudoElement.style.position = 'absolute';
  pseudoElement.style.top = '0';
  pseudoElement.style.left = '0';
  pseudoElement.style.width = '100%';
  pseudoElement.style.height = '100%';
  pseudoElement.style.zIndex = '-1';
  pseudoElement.style.filter = 'blur(0px) brightness(5%)';
  pseudoElement.style.backgroundImage = "url('" + img + "')";
  pseudoElement.style.backgroundSize = 'cover';
  pseudoElement.style.backgroundPosition = 'center';
  pseudoElement.style.backgroundRepeat = 'no-repeat';
  pseudoElement.style.imageRendering = '-webkit-optimize-contrast';
  root.appendChild(pseudoElement)
}

export function getHentaiEmbedSpankBang(query: string,  episode: any): string {
    //https://spankbang.party/s/Boku%20dake%20no%20Hentai%20Kanojo%20Motto%E2%99%A5%20THE%20ANIMATION%20episode%205/
    let title = query.replace(/[^\w\s]/gi, '%20').replace(/\s/g, "%20").toLowerCase();
    let url: string = `https://spankbang.party/s/hentai%20${title}%20episode%20${episode}/`;
    fetch(url).then(response => console.log(response.text));
    return url;
  }

  // /**
  //  * 
  //  * @param query 
  //  * @param episode 
  //  * @returns 
  //  */
  // export function getHentaiEmbedHentaiHaven(query: string,  episode: any): string {
  //   //https://spankbang.party/s/Boku%20dake%20no%20Hentai%20Kanojo%20Motto%E2%99%A5%20THE%20ANIMATION%20episode%205/
  //   let title = query.replace(/[^\w\s]/gi, '-').replace(/\s/g, "-").toLowerCase();
    
  //   if(title.startsWith('-')) {
  //     title = title.slice(1);
  //   }
  //   if(title.endsWith('-')) {
  //     title = title.slice(0, -1);
  //   }

  //   let url: string = `https://hentaihaven.xxx/watch/${title}/episode-${episode}/`;
  //   fetch(url).then(response => console.log(response.text));
  //   return url;
  // }

  export function getHentaiEmbed(query: string,  episode: any): string {
    let title = query.replace(/[^\w\s]/gi, '-').replace(/\s/g, "-").toLowerCase();
    
    if(title.startsWith('-')) {
      title = title.slice(1);
    }
    if(title.endsWith('-')) {
      title = title.slice(0, -1);
    }

    let url: string = `https://hentaihaven.xxx/watch/${title}/episode-${episode}/`;
    return url;
  }

  export async function searchHentai1(): Promise<AnimeQuery[]> {
  
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query {
            Page {
              media (type: ANIME, isAdult: true, sort: SCORE_DESC) {
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
              }
            }
          }
        `,
        variables: {}
      })
    });
  
    const data = await response.json();
  
    return data.data.Page.media;
  }

  export async function searchHentai2(): Promise<AnimeQuery[]> {
  
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        query: `
          query {
            Page {
              media (type: ANIME, isAdult: true, sort: END_DATE_DESC) {
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
              }
            }
          }
        `,
        variables: {}
      })
    });
  
    const data = await response.json();
  
    return data.data.Page.media;
  }

  
  export async function searchHentai3(sort: String): Promise<AnimeQuery[]> {
  
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query {
            Page {
              media (type: ANIME, isAdult: true, sort: ${sort}) {
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
              }
            }
          }
        `,
        variables: {}
      })
    });
  
    const data = await response.json();
  
    return data.data.Page.media;
  }

async function searchSyntexDev3(query: string): Promise<AnimeQuery[]> {

  if(query.startsWith(':hentai-new')) {
      return searchHentai2();
  }

  if(query.startsWith(':hentai')) {
      return searchHentai1();
  }

  if(query.startsWith(':hsort:')) {
    return searchHentai3(query.split(":")[2]);
  }

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      query: `
        query ($search: String) {
          Page {
            media (search: $search, type: ANIME, isAdult: true) {
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
            }
          }
          
        }
      `,
      variables: { search: query }
    })
  });

  const data = await response.json();

  return data.data.Page.media;
}

export async function search(query: string, filters?: string): Promise<any[]> {

  // const profile = await getCurrentProfile();

  // if(profile.accountInformation.nsfw === true){
  //   return searchSyntexDev3(query);
  // }

  //type: ANIME ${isAdult}

  // const response = await fetch('https://graphql.anilist.co', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     query: `
  //       query ($search: String) {
  //         Page {
  //           media (search: $search, type: ANIME${suffix}) {
  //             id
  //             episodes
  //             title {
  //               romaji
  //               english
  //               native
  //             }
  //             description
  //             coverImage {
  //               extraLarge
  //               color
  //             }
  //           }
  //         }
  //       }
  //     `,
  //     variables: { search: query }
  //   })
  // });

  let hostname = 'localhost';
  let port = `3023`;
  
  let url = `http://${hostname}:${port}/searchContent?query=${query}` + (filters ? `${filters}` : '');

  console.log(url);

  const response = await fetch(url);

  const data = await response.json();

  return data.data.Page;
}


export async function getProfiles(): Promise<any> {

  let hostname = 'localhost';
  let port = `3023`;
  
  let url = `http://${hostname}:${port}/getUserProfiles`;

  const response = await fetch(url);

  const data = await response.json();

  return data;
}

export async function getCurrentProfile(): Promise<any> {

  let hostname = 'localhost';
  let port = `3023`;
  
  let url = `http://${hostname}:${port}/getUserProfile`;

  const response = await fetch(url);

  const data = await response.json();

  return data;
}

export async function searchManga(query: string): Promise<AnilistMedia[]> {

  let nsfw = query.endsWith(':nsfw');

  if(nsfw) {
    query = query.slice(0, -5);
  }


  // sort: TITLE_ENGLISH
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      query: `
        query ($search: String) {
          Page (page: 1, perPage: 50) {
            media (search: $search, type: MANGA, isAdult: ${nsfw}, sort: TITLE_ENGLISH_DESC) {
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
            }
          }
        }
      `,
      variables: { search: query }
    })
  });

  const data = await response.json();

  return data.data.Page.media;
}

export async function getAnimeById(variables: Record<string, any>): Promise<Anime> {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      query: `
        query ($id: Int) {
          Media (id: $id, type: ANIME) {
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
            trailer {
              id
              site
              thumbnail
            }
          }
        }
      `,
      variables: variables
    })
  });

  const data = await response.json();

  //console.log(data);

  return data.data.Media;
}


export async function getMangaById(variables: Record<string, any>): Promise<Manga> {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      query: `
        query ($id: Int) {
          Media (id: $id, type: MANGA) {
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
            genres
            synonyms
            format
            source
            chapters
            volumes
            averageScore
          }
        }
      `,
      variables: variables
    })
  });

  const data = await response.json();

  console.log(data);

  return data.data.Media;
}


export function searchHmv(query: string): string {
  axios.get('https://spankbang.com/s/hmv%20hentai/' + query).then(response => console.log(response.data));

  return "";
}

interface UserData {
  id: number;
  name: string;
  email: string;
  avatar: {
    medium: string;
  };
}

export async function getUserData(authKey : string): Promise<UserData> {
  const url = 'https://graphql.anilist.co';
  const query = `
    query {
      Viewer {
        id
        name
        email
        avatar {
          medium
        }
      }
    }
  `;
  const variables = {};

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authKey}`
    },
    body: JSON.stringify({ query, variables })
  });

  const data = await response.json();

  if (response.ok) {
    return data.data.Viewer;
  } else {
    throw new Error(data.errors[0].message);
  }
}

export async function getRandomPGif(){
  
}

export async function getRandomHentaiGif(){
 let arr : string[] = [
  "https://m4.hentaiera.com/013/4be3aztrfv/11.gif",
  "https://m4.hentaiera.com/013/4be3aztrfv/213.jpg",
  "https://m4.hentaiera.com/013/4be3aztrfv/27.gif",
  "https://m4.hentaiera.com/013/4be3aztrfv/82.gif",
  "https://m4.hentaiera.com/013/4be3aztrfv/129.gif",
  "https://m4.hentaiera.com/013/4be3aztrfv/127.gif",
  "https://m4.hentaiera.com/013/4be3aztrfv/158.jpg",
  "https://m4.hentaiera.com/013/4be3aztrfv/172.jpg",
  "https://m4.hentaiera.com/013/4be3aztrfv/177.jpg",
  "https://m4.hentaiera.com/013/4be3aztrfv/176.jpg",
  "https://m4.hentaiera.com/013/4be3aztrfv/175.jpg",
  "https://m4.hentaiera.com/013/4be3aztrfv/218.jpg",
  "https://m1.hentaiera.com/003/jsk1278ezq/5.jpg",
  "https://m1.hentaiera.com/003/jsk1278ezq/207.jpg",
  "https://m1.hentaiera.com/003/jsk1278ezq/283.jpg",
  "https://m1.hentaiera.com/003/2hgiwmer9s/2.gif",
  "https://m1.hentaiera.com/003/2hgiwmer9s/3.gif",
  "https://m1.hentaiera.com/003/2hgiwmer9s/25.gif",
  "https://m1.hentaiera.com/003/2hgiwmer9s/23.gif",
  "https://m1.hentaiera.com/007/yix2ag9onb/1.gif",
  "https://m1.hentaiera.com/007/yix2ag9onb/11.gif",
  "https://m1.hentaiera.com/007/yix2ag9onb/27.gif",
  "https://m1.hentaiera.com/007/pk5juhca2r/62.gif",
  "https://m1.hentaiera.com/007/pk5juhca2r/61.gif",
  "https://m1.hentaiera.com/007/pk5juhca2r/67.gif",
  "https://m1.hentaiera.com/007/pk5juhca2r/19.gif",
  "https://m1.hentaiera.com/007/pk5juhca2r/1.gif",
  "https://m1.hentaiera.com/007/pk5juhca2r/12.gif",
  "https://sgnejkn.hbloijujiaky.hath.network/h/a575b025d27c66f22199cf99dc4c74f75b1df9fe-1616662-1067-600-gif/keystamp=1694892900-d8ccdd85eb;fileindex=53184347;xres=org/005.gif",
  "https://lkcrxrz.algmffcwddmj.hath.network:55555/h/545edb06b140f045d19e9d969126a398b7e91fcb-4833052-1058-1060-gif/keystamp=1694892900-5738f13619;fileindex=53295464;xres=org/033.gif",
  "https://nwuqksq.vheuswononrt.hath.network:1100/h/e1cf3a4a774b6ce6c19bbe62cb73986f44d05287-2850273-1060-847-gif/keystamp=1694892900-870d390ee9;fileindex=53184354;xres=org/035.gif",
  "https://m3.hentaiera.com/010/aonc0p9f1w/63.gif",
  "https://m3.hentaiera.com/010/aonc0p9f1w/68.gif",
  "https://m4.hentaiera.com/013/7eluzhobic/7.gif",
  "https://m4.hentaiera.com/013/7eluzhobic/25.gif",
  "https://m3.hentaiera.com/013/9cmlbihu7s/10.gif",
  "https://m3.hentaiera.com/013/9cmlbihu7s/14.gif",
  "https://m3.hentaiera.com/013/9cmlbihu7s/17.gif",
  "https://m3.hentaiera.com/013/9cmlbihu7s/55.gif",
  "https://m3.hentaiera.com/013/9cmlbihu7s/52.gif",
  "https://m3.hentaiera.com/013/9cmlbihu7s/42.gif",
  "https://m3.hentaiera.com/013/9cmlbihu7s/34.gif",
  "https://m3.hentaiera.com/013/9cmlbihu7s/26.gif",
  "https://m3.hentaiera.com/013/9cmlbihu7s/25.gif",
  "https://m3.hentaiera.com/013/vah9emkqxc/23.jpg",
  "https://m3.hentaiera.com/013/vah9emkqxc/283.jpg",
  "https://m3.hentaiera.com/011/knbxldgjt5/2.jpg",
  "https://m3.hentaiera.com/011/knbxldgjt5/34.jpg",
  "https://m2.hentaiera.com/009/72mw5oevgz/18.gif",
  "https://m2.hentaiera.com/009/72mw5oevgz/20.gif",
  "https://m2.hentaiera.com/009/72mw5oevgz/19.gif",
  "https://m2.hentaiera.com/009/72mw5oevgz/6.gif",
  "https://m8.hentaiera.com/024/3nr9lw216s/10.gif",
  "https://m8.hentaiera.com/024/3nr9lw216s/11.gif",
  "https://m8.hentaiera.com/024/pifsc8zube/26.gif",
  "https://m8.hentaiera.com/024/pifsc8zube/45.gif",
  "https://m8.hentaiera.com/024/pifsc8zube/141.gif",
  "https://m8.hentaiera.com/024/pifsc8zube/135.gif",
  "https://m8.hentaiera.com/024/pifsc8zube/195.gif",

 ]

  return arr[Math.floor(Math.random() * arr.length)];
}

export async function getRandomImage(id : string){
  switch(id){
    case "getRandomHentaiGifTits":
      return getRandomHentaiGifTits();
    case "getRandomHentaiGif":
      return getRandomHentaiGif();
    case "getRandomHentaiGif2":
      return getRandomHentaiGif2();
    case "getRandomHentaiGif3":
      return getRandomHentaiGif3();
    case "getRandomHentaiGif4":
      return getRandomHentaiGif4();
    case "getRandomHentaiGif5":
      return getRandomHentaiGif5();
  }

  return getRandomHentaiGifTits();
}

export function getRandomImageOptions(){
  return [
    "getRandomHentaiGifTits",
    "getRandomHentaiGif",
    "getRandomHentaiGif2",
    "getRandomHentaiGif3",
    "getRandomHentaiGif4",
    "getRandomHentaiGif4",
    "getRandomHentaiGif5",
  ];
}

export async function getRandomHentaiGifTits(){

  const arr = [];

  for (let i = 1; i < 350; i++) {
    arr.push(`https://m5.hentaiera.com/018/odlu5tbeq0/${i}.gif`);
  }
 
   return arr[Math.floor(Math.random() * arr.length)];
 }

 export async function getRandomHentaiPanels(){

  const arr = [];

  for (let i = 1; i < 600; i++) {
    arr.push(`https://m8.hentaiera.com/024/k70cejxyhm/${i}.jpg`);
  }
 
   return arr[Math.floor(Math.random() * arr.length)];
 }

 export async function getRandomHentaiGif5(){

  const arr = [];

  for (let i = 1; i < 155; i++) {
    arr.push(`https://m8.hentaiera.com/024/m6sztojfcr/${i}.gif`);
  }
 
   return arr[Math.floor(Math.random() * arr.length)];
 }

export async function getRandomHentaiGif4(){

  const arr = [];

  for (let i = 1; i < 350; i++) {
    arr.push(`https://m5.hentaiera.com/019/d5v7hajz84/${i}.gif`);
  }
 
   return arr[Math.floor(Math.random() * arr.length)];
 }

export async function getRandomHentaiGif3(){

  const arr = [];

  for (let i = 1; i < 11; i++) {
    arr.push(`https://m6.hentaiera.com/020/afzjqctp6g/${i}.gif`);
    arr.push(`https://m7.hentaiera.com/022/twpn80hxfu/${i}.gif`)
  }
 
   return arr[Math.floor(Math.random() * arr.length)];
 }

export async function getRandomHentaiGif2(){

  const arr = [];

  for (let i = 0; i < 1000; i++) {
    arr.push(`https://m5.hentaiera.com/018/073c4thre8/${i}.jpg`);
  }
 
   return arr[Math.floor(Math.random() * arr.length)];
 }

 export async function getRandomPhImage(){

  const arr = [];

  for (let i = 0; i < 1000; i++) {
    arr.push(`https://m5.hentaiera.com/018/073c4thre8/${i}.jpg`);
  }
 
   return arr[Math.floor(Math.random() * arr.length)];
 }

export async function getRandomHentaiBanner(){

 const arr = [
  "https://bylsqbv.vqfoeerqulye.hath.network/h/648bbb3bbaebcce6e8d14ec56a34347a2b54fb88-1950761-1067-600-gif/keystamp=1694892900-3a9338b2ee;fileindex=53055587;xres=org/003.gif",
  "https://nhlkedw.aqefzmwktvys.hath.network:54200/h/a8ce426ceb3c73fa3ccd289311f3a2c25a591cd8-2011627-1060-629-gif/keystamp=1694892900-872a784448;fileindex=53184356;xres=org/004.gif",
  "https://vdbbtue.taagkdnueddo.hath.network:34211/h/f12ee9a3f90afd0208ead8a50864ebb4014ffee9-2839217-1103-600-gif/keystamp=1694892900-000523887c;fileindex=53184352;xres=org/014.gif",
  "https://m3.hentaiera.com/013/9cmlbihu7s/17.gif"
]

  return getRandomHentaiGif2();

}


// export function getHmvList(): string[] {
//   return [

//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_crav_on-Big-Fuck.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_gh3ttolobsta-Make-It-Rain.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_IravOrRyd-Off-Down.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_DarkFlameMaster-KT-SEA-OF-PHONK-STYLE.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_IPHERUS-Phonky-Hero-round-10.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_IPHERUS-Phonky-Hero-round-9.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_IPHERUS-Phonky-Hero-round-3.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Butajiri-HMV-G37.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_IravOrRyd-Geisha-Atomic-Overdrive.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_IravOrRyd-Augura-1033.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_original-racing-black-beast.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_IravOrRyd-Adrenaline.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_ToxiQue-Fap-Hero-Sauvage-Round-3.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_MilfHentai-DAIMON-NAOKO.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_IPHERUS-Phonky-Hero-round-15.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_Deus-Yato-Inkou-Kyoushi-No-Saimin-Seikatsu-Sex-Slave.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_Albinohawk-Secret-Life.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_IPHERUS-Phonky-Hero-round-8.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_boyxteen99-DONT-WANT-UR-LOVE.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Itisstrike-Blowin-Chizuru.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_TheDraigc-Rented-Wife.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_dirt-Fun-with-Dark-Elves.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_BMK-Lets-get-some-smoky-7.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Somatic-Super-Slut-Alert.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Ding-Ding-All-the-Rich-Girls-Said.mp4",
//     "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Hibootys-Sugar-daddy-part-2.mp4"

//   ];
// }
  
export function getHmvList(): string[] {
  return [

    "https://hmvmania.com/wp-content/uploads/2022/03/mp4/hmv_1080p_%5Bxyz_hmv%5D%20Sexual%20Curse.mp4",
    "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_opai998877-OVA-sexual-cult-12.mp4"

  ];
}