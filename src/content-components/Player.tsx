import * as titleBar from '../components/TitleBar';
import '../stylings/content/player.css';

import * as animeflix from '../content-source/animeflix.ts';
import * as discord from '../content-source/discord-api.ts';
import { useEffect } from 'react';

// Function to get the uri for the embed of the episode
function getUriEmbed(title: string, episode: string) : string{
  const url = `https://animeflix.live/watch/${title.replace(/[^\w\s-]/gi, "").replace(/\s+/g, "-").toLowerCase()}-episode-${episode}/`;
  return url;
}

export default function Player(props: { url?: string, nsfw?: boolean, entry: any, episodeNumber: string}) {
  let amountOfTries = 2;

  let url = props.url;
  let nsfw = props.nsfw;

  const forceAniflix = false;

  if(nsfw === undefined || nsfw === null){
    nsfw = props.entry.isAdult;
  }

  if(url === undefined || url === null) {
    if(nsfw && !forceAniflix){
      url = animeflix.getHentaiEmbed(props.entry.title.romaji, props.episodeNumber);
      amountOfTries = Infinity;
    }else{
      url = getUriEmbed(props.entry.title.romaji, props.episodeNumber);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      animeflix.updateEpisodeForUser(props.entry.id, props.episodeNumber);
    }, 1 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [props.entry.id, props.episodeNumber]);


  if(!nsfw){ 
    discord.setWatchingAnime(props.entry.title.romaji, parseInt(props.episodeNumber), props.entry.episodes, props.entry.coverImage.extraLarge);
  }

  function handleLoad() {
    if (--amountOfTries === 0 && !props.nsfw) {
      titleBar.handleBack();
    }
  }

  console.log("Player: " + url);

  return (
      <iframe src={url} allowFullScreen onLoad={handleLoad}></iframe>
  ); 
  
}

