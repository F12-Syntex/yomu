import axios from "axios";

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
export function updateEpisodeForUser(props: Anime, episode: string) {
  const port = `3023`;
  const authKeyUri = "http://localhost:" + port + "/authenticate";

  // Get authentication key from server
  axios.get(authKeyUri)
    .then(response => {
      const authKey = response.data;
      const uri = "http://localhost:" + port + `/updateEpisodeForUser?animeId=${props.id}&episode=${episode}&authkey=${authKey}`;
      axios.get(uri);
    })
    .catch(error => {
      console.error(error);
    });
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
            media (type: ANIME, isAdult: false, sort: TRENDING_DESC) {
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



export async function search(query: string): Promise<AnimeQuery[]> {
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
            media (search: $search, type: ANIME, isAdult: false) {
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
          Media (id: $id, type: ANIME,  isAdult: false) {
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
