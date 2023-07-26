import * as titleBar from '../components/TitleBar';
import '../stylings/content/player.css';

import * as animeflix from '../content-source/animeflix.ts';
import * as discord from '../content-source/discord-api.ts';

export default function Player(props: { url: string, nsfw: boolean, entry: any, episodeNumber: string}) {
  let amountOfTries = 2;

  function handleLoad() {
    if (--amountOfTries === 0 && !props.nsfw) {
      titleBar.handleBack();
    }
  }

  animeflix.updateEpisodeForUser(props.entry.id, props.episodeNumber);
  discord.setWatchingAnime(props.entry.title.romaji, parseInt(props.episodeNumber), props.entry.episodes, props.entry.coverImage.extraLarge);

  return (
    <>
      <iframe src={props.url} allowFullScreen onLoad={handleLoad}></iframe>
    </>
  );
}