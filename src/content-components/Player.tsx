import * as titleBar from '../components/TitleBar';
import '../stylings/content/player.css';
import * as animeflix from '../content-source/animeflix.ts';
import * as discord from '../content-source/discord-api.ts';

export default function Player(props: { url: string, nsfw: boolean, title: string, episodes: number, id: number, coverImage: string, episode: number}) {
  let amountOfTries = 2;

  discord.setWatchingAnime(props.title, props.episode, props.episodes, props.coverImage);
  animeflix.updateEpisodeForUser(props.id, props.episode);

  function handleLoad() {
    if (--amountOfTries === 0 && !props.nsfw) {
      titleBar.handleBack();
    }
  }

  return (
    <>
      <iframe src={props.url} allowFullScreen onLoad={handleLoad}></iframe>
    </>
  );
}