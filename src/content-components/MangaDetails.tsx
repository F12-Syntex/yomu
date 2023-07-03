import { useEffect } from 'react';
import * as sideMenu from '../utils/SideMenu.ts';
import * as aniflix from '../content-source/animeflix.ts';
import * as mangakalot from '../content-source/mangakakalot.ts';
import * as State from '../core/State.ts';

import '../stylings/content/manga-details.css';
import Player from './Player.tsx';

type MangaDetailsProps = {
  entry?: mangakalot.MangaEntry;
  anime?: aniflix.Anime;
}

async function load(aniData: Promise<aniflix.Anime>) {
    const anime = await aniData;
    run(anime);
}


async function run(aniData: aniflix.Anime) {
  
  const anime = aniData;

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
  pseudoElement.style.backgroundImage = "url('" + anime.bannerImage + "')";
  pseudoElement.style.backgroundSize = 'cover';
  pseudoElement.style.backgroundPosition = 'center';
  pseudoElement.style.backgroundRepeat = 'no-repeat';
  pseudoElement.style.imageRendering = '-webkit-optimize-contrast';
  root.appendChild(pseudoElement)

  const cover = document.getElementById('mangadetails-cover')! as HTMLImageElement;
  cover.src = anime.coverImage.extraLarge;

  const title = document.getElementById('mangadetails-title')!;
  title.innerHTML = anime.title.romaji;

  const description = document.getElementById('mangadetails-description')!;
  description.innerHTML = anime.description;

  const format = document.getElementById('content-details-info-format-data')!;
  format.innerHTML = anime.format;

  const episodes = document.getElementById('content-details-info-episode-data')!;


  console.log(anime.status);
  if(anime.status === 'RELEASING') {
    episodes.innerHTML = "airing";
  }else{
    episodes.innerHTML = anime.episodes.toString();
  }

  const episode_duration = document.getElementById('content-details-info-episode-duration-data')!;
  episode_duration.innerHTML = anime.duration.toString() + ' minutes';

  const status = document.getElementById('content-details-info-status-data')!;
  status.innerHTML = anime.status;

  const average_score = document.getElementById('content-details-info-average-score-data')!;
  average_score.innerHTML = anime.averageScore.toString() + '%';

  const studios = document.getElementById('content-details-info-studios-data')!;
  studios.innerHTML = anime.studios.nodes[0].name;

  const genres = document.getElementById('content-details-info-genres-data')!;
  genres.innerHTML = anime.genres.toString().split(',').join(', ');

  //addRelations(anime);
  addEpisodes(anime);
}

function addEpisodes(anime : aniflix.Anime){
  
  const streamingEpisodes: { title: string; thumbnail: string; url: string; site: string; }[] = anime.streamingEpisodes;
  const episodes = document.querySelector('.content-episodes')!;

  console.log(streamingEpisodes);

  const container = document.createElement('div');
  container.className = 'content-episodes-item-container';

  let episodeCount : number = 0;

  if(anime.episodes == undefined && anime.nextAiringEpisode != undefined){
    episodeCount = anime.nextAiringEpisode?.episode;
  }else{
    episodeCount = anime.episodes;
  }

  for (let i = 0; i < episodeCount; i++) {
    const relation = document.createElement('div');
    relation.className = 'content-episodes-item';
  
    const textContainer = document.createElement('div');
    textContainer.className = 'content-episodes-item-text-container';

    const relationTitle = document.createElement('a');
    relationTitle.className = 'content-episodes-item-title-number';

    const episodeNumber = (i + 1).toString();

    // Check if episode exists in streamingEpisodes
    const streamingEpisode = streamingEpisodes.find(ep => (ep.title + "Episode 1").split("Episode ")[1].split(" ")[0] == (i + 1).toString());

    if (streamingEpisode) {
      relation.style.backgroundImage = `url('${streamingEpisode.thumbnail}')`;
      relationTitle.innerHTML = streamingEpisode.title;

    }else{
      relationTitle.innerHTML = 'Episode ' + episodeNumber;
      relation.style.backgroundImage = `url('${anime.bannerImage}')`;
      relation.style.backgroundSize = `auto 100%`;
    }

    
    textContainer.appendChild(relationTitle);
  
    console.log("appended episode " + episodeNumber + " to container");
  
    relation.addEventListener('click', () => {

      // const aniListUrl = "https://anilist.co/" + anime.format + "/" + anime.id;
      // console.log(anime.format + ": " + aniListUrl);

      // if(anime.format !== "TV"){
      //   State.updateState(<Player url={aniListUrl}/>);
      //   return;
      // }

      aniflix.updateEpisodeForUser(anime, episodeNumber);

      const url = `https://animeflix.live/watch/${anime.title.romaji.replace(/[^\w\s]/gi, "").replace(/\s+/g, "-").toLowerCase()}-episode-${episodeNumber}/`;
      console.log(url); 
      State.updateState(<Player url={url}/>);
      
    });
  
    relation.appendChild(textContainer);
    container.appendChild(relation);
  }

  episodes.appendChild(container);

}

// function addRelations(anime : aniflix.Anime){
//     const relations = document.querySelector('.content-relations')!;
//     const edges : {relationType: string; node: aniflix.Anime;}[] = anime.relations.edges;

//     const container = document.createElement('div');
//     container.className = 'content-relations-item-container';

//     for (let i = 0; i < edges.length; i++) {
//       const node: aniflix.Anime = edges[i].node;
//       const relationType = edges[i].relationType;

//       const relation = document.createElement('div');
//       relation.className = 'content-relations-item';

//       const relationImage = document.createElement('img');
//       relationImage.className = 'content-relations-item-image';
//       relationImage.src = node.coverImage.extraLarge;
//       relationImage.alt = 'relation cover';
//       relation.appendChild(relationImage);

//       const textContainer = document.createElement('div');
//       textContainer.className = 'content-relations-item-text-container';

//       const relationTypeElement = document.createElement('h4');
//       relationTypeElement.className = 'content-relations-item-type';
//       relationTypeElement.innerHTML = relationType;
//       textContainer.appendChild(relationTypeElement);

//       const relationTitle = document.createElement('h3');
//       relationTitle.className = 'content-relations-item-title';
//       relationTitle.innerHTML = node.title.romaji;
//       textContainer.appendChild(relationTitle);

//       relation.appendChild(textContainer);

//       relation.addEventListener('click', () => {
//         //node.relations = anime.relations;
//         const state = <MangaDetails anime={node} key={Date.now()} />;

//         State.updateState(state);
//       });

//       container.appendChild(relation);
//     }

//     relations.appendChild(container);
// }

async function getMangaDetails(id: number) {

  sideMenu.toggle(document.getElementById('sidemenu-search')!);

  const response: Promise<aniflix.Anime> = aniflix.getAnimeById({ id: id });

  const anime = await response;

  return anime;
}


export default function MangaDetails(props: MangaDetailsProps) {


  console.log("running manga details");

  const entry = props.entry;
  const anime = props.anime;

  if(anime?.id == undefined){
    console.log("loading anime from entry [not in effect]");
    useEffect(() => {

      const detailspane = document.getElementById('mangadetails-child-container');

      if(detailspane == null){
        return;
      }

      detailspane.style.opacity = "0";

      console.log("loading anime from entry");
      if(entry == undefined){
        return;
      }
      console.log("loading anime");
      const data = entry.manga;
      const promisedAnime = getMangaDetails(data.id);
      load(promisedAnime).then(() => {
        detailspane.style.opacity = "1";
        document.getElementById('mangadetails-pane-container')!.style.backgroundImage = `none`;
      });

      
    }, []);
  }else{
    //useEffect(() => {
      //document.querySelector('.content-relations')!.childNodes.forEach((node) => { node.remove(); }); 
      console.log("running anime");
      run(anime);


      document.getElementById('mangadetails-pane-container')!.style.backgroundImage = `none`;

    //}, []);
  }
  
    return (
      <>
        {
          <div id='mangadetails-pane-container'>
            <div className='mangadetails-pane' id='mangadetails-child-container'>
              <div className='content-details'>
                <div className='content-details-container'>
                  <div className='content-details-image'>
                    <img src="" id='mangadetails-cover' alt='manga cover' className='manga-cover'/>
                  </div>
                  <div className='content-details-info'>
                    <div className='content-details-info-format'>
                      <h3 id = 'content-details-label'>Format</h3>
                      <h3 id='content-details-info-format-data'>Dummy data</h3>
                    </div>
                    <br/>
                    <div className='content-details-info-episode'>
                      <h3 id = 'content-details-label'>Episodes</h3>
                      <h3 id='content-details-info-episode-data'>Dummy data</h3>
                    </div>
                    <br/>
                    <div className='content-details-info-episode-duration'>
                      <h3 id = 'content-details-label'>Episode duration</h3>
                      <h3 id='content-details-info-episode-duration-data'>Dummy data</h3>
                    </div>
                    <br/>
                    <div className='content-details-info-status'>
                      <h3 id = 'content-details-label'>Status</h3>
                      <h3 id='content-details-info-status-data'>Dummy data</h3>
                    </div>
                    <br/>
                    <div className='content-details-info-average-score'>
                    <h3 id = 'content-details-label'>Average score</h3>
                      <h3 id='content-details-info-average-score-data'>Dummy data</h3>
                    </div>
                    <br/>
                    <div className='content-details-info-studios'>
                      <h3 id = 'content-details-label'>Studios</h3>
                      <h3 id='content-details-info-studios-data'>Dummy data</h3>
                    </div>
                    <br/>
                    <div className='content-details-info-genres'>
                      <h3 id = 'content-details-label'>Genres</h3>
                      <h3 id='content-details-info-genres-data'>Dummy data</h3>
                    </div>
                    <br/>
                  </div>
                </div>
              </div>
              <div className='content-description-container'>
                <div className='content-description'>
                    <h1 id='mangadetails-title'>Dummy data</h1>
                    <h3 id='mangadetails-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor eros vel lectus laoreet luctus. Nullam bibendum sapien eget metus malesuada, in faucibus nisi venenatis. Ut euismod ante sed risus ornare, non fermentum nulla varius. Morbi ac augue id odio dictum iaculis quis et massa. Fusce tristique, nisl nec aliquet vestibulum, sapien quam ultricies purus, vel eleifend orci mi vitae mauris. Sed quis est pharetra, tincidunt tortor at, rhoncus enim. Proin dapibus, arcu eu ultrices sagittis</h3>
                      {/* <div className='content-relations'></div>  */}
                    <div className='content-episodes-and-relations'>
                      <div className='content-episodes'></div>
                    </div>
                </div>
              </div>
            </div> 
        </div>
        }
    </>
    );

}