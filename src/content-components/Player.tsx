import * as titleBar from '../components/TitleBar';
import '../stylings/content/player.css';

import * as animeflix from '../content-source/animeflix.ts';
import * as discord from '../content-source/discord-api.ts';
import { useEffect } from 'react';


function getUriEmbed(title: string, episode: string) : string{
  const url = `https://animeflix.live/watch/${title.replace(/[^\w\s]/gi, "").replace(/\s+/g, "-").toLowerCase()}-episode-${episode}/`;
  return url;
}

export default function Player(props: { url?: string, nsfw?: boolean, entry: any, episodeNumber: string}) {
  let amountOfTries = 2;

  let url = props.url;
  let nsfw = props.nsfw;

  if(nsfw === undefined || nsfw === null){
    nsfw = props.entry.isAdult;
  }

  if(url === undefined || url === null) {
    if(nsfw){
      url = animeflix.getHentaiEmbedSpankBang(props.entry.title.romaji, props.episodeNumber);
      amountOfTries = Infinity;
    }else{
      url = getUriEmbed(props.entry.title.romaji, props.episodeNumber);
    }
  }

  if(!nsfw){
    animeflix.updateEpisodeForUser(props.entry.id, props.episodeNumber);
    discord.setWatchingAnime(props.entry.title.romaji, parseInt(props.episodeNumber), props.entry.episodes, props.entry.coverImage.extraLarge);
  }

  function handleLoad() {
    if (--amountOfTries === 0 && !props.nsfw) {
      titleBar.handleBack();
    }
  }

  return (
    <>
      <iframe src={url} allowFullScreen onLoad={handleLoad}></iframe>
    </>
  );
}