import { useEffect } from 'react';
import * as aniflix from '../content-source/animeflix.ts';
import * as discord from '../content-source/discord-api.ts';
import * as mangakalot from '../content-source/mangakakalot.ts';
import * as State from '../core/State.ts';
import * as sideMenu from '../utils/SideMenu.ts';

import { MangaEntry } from '../content-source/mangakakalot.ts';
import '../stylings/content/manga-details.css';
import Player from './Player.tsx';

type MangaDetailsProps = {
  entry?: mangakalot.MangaEntry;
  anime?: aniflix.Anime;
}

async function load(aniData: Promise<aniflix.Anime>) {
    const anime = await aniData;
    discord.BrowsingAnime(anime);
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
    if(anime.episodes){
      episodes.innerHTML = anime.episodes.toString();
    }else{
      episodes.innerHTML = "Unknown"
    }
  }

  const episode_duration = document.getElementById('content-details-info-episode-duration-data')!;

  if(anime.duration){
    episode_duration.innerHTML = anime.duration.toString() + ' minutes';
  }

  const status = document.getElementById('content-details-info-status-data')!;
  status.innerHTML = anime.status;

  const average_score = document.getElementById('content-details-info-average-score-data')!;

  if(anime.averageScore){
    average_score.innerHTML = anime.averageScore.toString() + '%';
  }


  const studios = document.getElementById('content-details-info-studios-data')!;
  if(anime.studios.nodes[0] == undefined){
    studios.innerHTML = "unknown";
  }else{
    studios.innerHTML = anime.studios.nodes[0].name;
  }

  const genres = document.getElementById('content-details-info-genres-data')!;
  genres.innerHTML = anime.genres.toString().split(',').join(', ');

  addTrailer(anime);
  addRelations(anime);
  addEpisodes(anime);
}

function addTrailer(anime : aniflix.Anime){
  const relations = document.querySelector('.content-relations')!;

  const label = document.createElement('div');
  label.className = 'content-episodes-label';
  label.innerHTML = 'Trailer';

  if(!anime.trailer){
    return;
  }

  relations.appendChild(label);

  const relationItems = document.createElement('div');
  relationItems.className = 'content-trailer-pane';


  relations.appendChild(relationItems);

  //add the trailer
  const trailer = document.createElement('div');
  trailer.className = 'content-trailer-item';

  //embed the trailer
  const trailerEmbed = document.createElement('iframe');
  trailerEmbed.className = 'content-trailer-item-embed';
  const trailerUrl = anime.trailer.site === "youtube" ? "https://www.youtube.com/embed/" + anime.trailer.id : "https://www.dailymotion.com/embed/video/" + anime.trailer.id;
  trailerEmbed.src = trailerUrl;

  //enable fullscreen
  trailerEmbed.setAttribute('allowfullscreen', 'true');

  trailer.appendChild(trailerEmbed);
  relationItems.appendChild(trailer);
}

function addRelations(anime : aniflix.Anime){
  const relations = document.querySelector('.content-relations')!;

  const label = document.createElement('div');
  label.className = 'content-episodes-label';
  label.innerHTML = 'Related';

  const items = anime.relations.edges.filter(i => i.node.format !== "MUSIC" && i.node.format !== "MANGA");

  if(items.length == 0){
    return;
  }

  relations.appendChild(label);

  const relationItems = document.createElement('div');
  relationItems.className = 'content-relations-pane';


  relations.appendChild(relationItems);

  items.forEach(relation => {
    const relationType = relation.relationType;
    const relationNode = relation.node;
    addRelation(relationNode, relationType, relationItems);
  });
  

}

function addRelation(relation : aniflix.Anime, relationType : string, containerElement : Element){
  
    const entry = relation;
  
      if(entry.progress === undefined || entry.progress === null){
         entry.progress = 0;
      }
  
      //gets the next episode to watch, and if the episode is more than the total episodes, it will set it to the total episodes
      const episode = entry.progress + 1 > entry.episodes ? entry.episodes : entry.progress + 1;
  
  
      // Create child element with class 'profile-anime-entry'
      const animeEntryElement = document.createElement('div');
      animeEntryElement.classList.add('profile-anime-entry');
  
      // Create child element with class 'profile-anime-entry-header'
      const animeEntryHeaderElement = document.createElement('div');
      animeEntryHeaderElement.classList.add('profile-anime-entry-header');
  
      // Create child element with class 'profile-anime-entry-content'
      const animeEntryContentElement = document.createElement('div');
      animeEntryContentElement.classList.add('profile-anime-entry-content');
  
      // Create h1 element with id 'profile-anime-entry-title'
      const titleElement = document.createElement('h1');
      titleElement.setAttribute('id', 'profile-anime-entry-title');
      titleElement.textContent = entry.title.romaji + " (" + relationType.toLowerCase() + ")";
  
      const maxLength : number = 60;
  
      if(titleElement.textContent != undefined && titleElement.textContent?.length > maxLength){
        //titleElement.style.fontSize = '1rem';
        titleElement.textContent = titleElement.textContent.substring(0, maxLength).trim() + '...';
      }
  
      // Create h1 element with id 'profile-anime-entry-details'
      const detailsElement = document.createElement('h1');
      detailsElement.setAttribute('id', 'profile-anime-entry-details');
      detailsElement.textContent = 'CONTINUE FROM EPISODE ' + episode;
  
      // Append child elements to their respective parents
      animeEntryContentElement.appendChild(titleElement);
      animeEntryContentElement.appendChild(detailsElement);
      animeEntryElement.appendChild(animeEntryHeaderElement);
      animeEntryElement.appendChild(animeEntryContentElement);
  
      animeEntryHeaderElement.style.backgroundImage = `url(${entry.coverImage.extraLarge})`;
  
      // Append the parent element to the desired container in your HTML document
      containerElement?.appendChild(animeEntryElement);

      if(containerElement === null){	
        return;
      }
    
      containerElement.appendChild(animeEntryElement);
  
      detailsElement.addEventListener('mousedown', () => {
        const state = <Player entry={entry} episodeNumber={episode.toString()}/>;
        State.updateState(state);
      });
  
      animeEntryElement.addEventListener('click', () => {
  
        const queryEntry: MangaEntry = {
          manga: {
            id:  entry.id,
            alt: entry.title.romaji,
            img: entry.coverImage.extraLarge,
          },
        };

        const state = <MangaDetails entry={queryEntry}/>;
        State.updateState(state);
      });
}

function addEpisodes(anime : aniflix.Anime){
  
  const streamingEpisodes: { title: string; thumbnail: string; url: string; site: string; }[] = anime.streamingEpisodes;
  const episodes = document.querySelector('.content-episodes')!;

  const label = document.createElement('div');
  label.className = 'content-episodes-label';
  label.innerHTML = 'Episodes';

  episodes.appendChild(label);

  console.log(streamingEpisodes);

  const container = document.createElement('div');
  container.className = 'content-episodes-item-container';

  let episodeCount : number = 0;

  if(anime.episodes == undefined && anime.nextAiringEpisode != undefined){
    episodeCount = anime.nextAiringEpisode?.episode;
  }else{
    episodeCount = anime.episodes;
  }

  
  // if(anime.bannerImage){
  //   // Create the image element
  //   const img = document.createElement('img');

  //   // Set the src, alt, width, and height attributes
  //   img.src = anime.bannerImage;
  //   img.alt = 'Banner Image';

  //   document.getElementById('mangadetails-pane-container-banner')!.appendChild(img);
  // }


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

    //TODO colour watched episodes differently

    if (streamingEpisode) {
      relation.style.backgroundImage = `url('${streamingEpisode.thumbnail}')`;
      relationTitle.innerHTML = streamingEpisode.title;

      // if(i < 10){
      //   relation.classList.add('content-episodes-item-watched');
      //   relationTitle.innerHTML = streamingEpisode.title + " ( watched )";
      // }

    }else if(anime.bannerImage){
      relationTitle.innerHTML = 'Episode ' + episodeNumber;
      relation.style.backgroundImage = `url('${anime.bannerImage}')`;
      relation.style.backgroundSize = `auto 100%`;

      // if(i < 10){
      //   relation.classList.add('content-episodes-item-watched');
      //   relationTitle.innerHTML += " ( watched )";
      // }

    }else{
      relationTitle.innerHTML = 'Episode ' + episodeNumber;
      relation.style.backgroundImage = `url('${anime.coverImage.extraLarge}')`;
      relation.style.backgroundSize = `100% auto`;
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

      // aniflix.updateEpisodeForUser(anime.title.romaji, episodeNumber);
      // discord.setWatchingAnime(anime.title.romaji, parseInt(episodeNumber), anime.episodes, anime.coverImage.extraLarge);

      // console.log(url); 

      //let nsfw = false;

      //if(anime.isAdult){
        //https://watchhentai.net/jwplayer/?source=https%3A%2F%2Fhstorage.xyz%2Ffiles%2FO%2Foverflow%2Foverflow-1.mp4&id=1119&type=mp4
        //https://watchhentai.net/jwplayer/?source=https%3A%2F%2Fhstorage.xyz%2Ffiles%2FT%2Ftsurupeta-shugo-kishi-elfina-ochiru%2Ftsurupeta-shugo-kishi-elfina-ochiru-2.mp4&id=10721&type=mp4


        //https://watchhentai.net/jwplayer/?source=https%3A%2F%2Fhstorage.xyz%2Ffiles%2FH%2Fharem-camp%2Fharem-camp-6.mp4&id=4134&type=mp4&quality=1080p,720p
        //https://watchhentai.net/jwplayer/?source=https%3A%2F%2Fhstorage.xyz%2Ffiles%2FH%2FHarem-Camp%2FHarem-Camp-6.mp4
        // const name = anime.title.romaji.replace(/[^\w\s]/gi, '').replace(/\s/g, "-");
        // // url = aniflix.getHentaiEmbed(name, episodeNumber);
        // // console.log(url);
        // nsfw = true;
      //}

      State.updateState(<Player entry={anime} episodeNumber={episodeNumber}/>);
      
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

//manga details component
export default function MangaDetails(props: MangaDetailsProps) {

  console.log("running manga details");

  const entry = props.entry;
  const anime = props.anime;

  if(anime?.id == undefined){
    console.log("loading anime from entry [not in effect]: " + entry?.manga?.alt ?? "undefined");
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
      discord.BrowsingAnime(anime);


      document.getElementById('mangadetails-pane-container')!.style.backgroundImage = `none`;

    //}, []);
  }
  
    return (
      <>
        {
          <div id='mangadetails-pane-container-parent'>
            <div id='mangadetails-pane-container-banner'></div>
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
                        <h3 id='content-details-info-format-data'>N/A</h3>
                      </div>
                      <br/>
                      <div className='content-details-info-episode'>
                        <h3 id = 'content-details-label'>Episodes</h3>
                        <h3 id='content-details-info-episode-data'>N/A</h3>
                      </div>
                      <br/>
                      <div className='content-details-info-episode-duration'>
                        <h3 id = 'content-details-label'>Episode duration</h3>
                        <h3 id='content-details-info-episode-duration-data'>N/A</h3>
                      </div>
                      <br/>
                      <div className='content-details-info-status'>
                        <h3 id = 'content-details-label'>Status</h3>
                        <h3 id='content-details-info-status-data'>N/A</h3>
                      </div>
                      <br/>
                      <div className='content-details-info-average-score'>
                      <h3 id = 'content-details-label'>Average score</h3>
                        <h3 id='content-details-info-average-score-data'>N/A</h3>
                      </div>
                      <br/>
                      <div className='content-details-info-studios'>
                        <h3 id = 'content-details-label'>Studios</h3>
                        <h3 id='content-details-info-studios-data'>N/A</h3>
                      </div>
                      <br/>
                      <div className='content-details-info-genres'>
                        <h3 id = 'content-details-label'>Genres</h3>
                        <h3 id='content-details-info-genres-data'>N/A</h3>
                      </div>
                      <br/>
                    </div>
                  </div>
                </div>
                <div className='content-description-container'>
                  <div className='content-description'>
                      <h1 id='mangadetails-title'>N/A</h1>
                      <h3 id='mangadetails-description'>N/A</h3>
                        {/* <div className='content-relations'></div>  */}
                      <div className='content-episodes-and-relations'>
                        <div className='content-relations'></div>
                        <div className='content-episodes'></div>
                      </div>
                  </div>
                </div>
              </div> 
          </div>
        </div>
        }
    </>
    );

}