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

export function getHentaiEmbed(query: string,  episode: any): string {
    //https://spankbang.party/s/Boku%20dake%20no%20Hentai%20Kanojo%20Motto%E2%99%A5%20THE%20ANIMATION%20episode%205/
    let title = query.replace(/[^\w\s]/gi, '%20').replace(/\s/g, "%20").toLowerCase();
    let url: string = `https://spankbang.party/s/hentai%20${title}%20episode%20${episode}/`;

   
    fetch(url).then(response => console.log(response.text));

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


export async function search(query: string): Promise<AnimeQuery[]> {

  if(query.startsWith(':hentai-new')) {
    return searchHentai2();
  }

  if(query.startsWith(':hentai')) {
    return searchHentai1();
  }

  let nsfw = query.endsWith(':nsfw');
  let filter = query.includes(':filter: ') && query.includes(':end');

  let filteredString = '';

  if(nsfw) {
    query = query.slice(0, -5);
  }

  if(filter) {
    filteredString = query.split(':filter: ')[1].split(':end')[0];
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
            media (search: $search, type: ANIME, isAdult: ${nsfw}) {
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
          Page {
            media (search: $search, type: MANGA, isAdult: ${nsfw}, sort: POPULARITY_DESC) {
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
