import axios from 'axios';
import { useEffect } from 'react';
import * as discord from '../content-source/discord-api.ts';
import * as State from '../core/State.ts';
import * as sideMenuUtils from '../utils/SideMenu.ts';
import { Section } from '../anilist/Section.ts';
import * as animeflix from '../content-source/animeflix.ts';

import { shell } from 'electron';
import Search from './Search.tsx';

const endpoint = 'callback';
const port = `3023`;
const redirectUri = "http://localhost:" + port + "/" + endpoint;
const authKeyUri = "http://localhost:" + port + "/authenticate";
const connectedUri = "http://localhost:" + port + "/isConnected";
const clientId = '13194';

const authoriseUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

import { MangaEntry } from '../content-source/mangakakalot.ts';
import MangaDetails from './MangaDetails.tsx';

import '../stylings/content/anilist.css';
import Player from './Player.tsx';

/**
 * new hot section
 * @returns 
 */
async function generateSections(){

  const sections : Section[] = [
    new Section("Popular", "popularity", "POPULARITY_DESC", "TV"),
    new Section("Trending Anime", "watching", "TRENDING_DESC", "TV"),
    new Section("Highest Rated", "score", "SCORE_DESC", "TV"),
    new Section("New movies", "movies", "END_DATE_DESC, status: FINISHED", "MOVIE"),
    // new Section("OVAS", "ovas", "SCORE_DESC", "OVA"),
    // new Section("ONA", "ona", "SCORE_DESC status: FINISHED", "ONA"),
    new Section("SPECIAL", "special", "SCORE_DESC status: FINISHED", "SPECIAL"),
  ];

  const section: Element | null = document.querySelector('.profile-video-pane-currently-watching-container');

  if(section === null || section === undefined){
    return;
  }

  for (const entry of sections) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'profile-section';
    sectionElement.id = `profile-section-${entry.getId()}`;

    const currentlyWatchingContainerHeader = document.createElement('div');
    currentlyWatchingContainerHeader.className = 'profile-video-pane-currently-watching-container-header';

    const profileHeaderLabel = document.createElement('h1');
    profileHeaderLabel.id = 'profile-header-label';
    profileHeaderLabel.textContent = entry.getSavedString();
    currentlyWatchingContainerHeader.appendChild(profileHeaderLabel);

    const profileVideoPaneAnimeGrid = document.createElement('div');
    profileVideoPaneAnimeGrid.className = 'profile-video-pane-anime-grid';
    profileVideoPaneAnimeGrid.id = `profile-video-pane-currently-${entry.getId()}`;

    const profileCurrentlyWatchingContainerHeaderExpand = document.createElement('div');
    profileCurrentlyWatchingContainerHeaderExpand.className = 'profile-video-pane-currently-watching-container-header-expand';
    profileCurrentlyWatchingContainerHeaderExpand.id = `profile-${entry.getId()}-container-header`;

    sectionElement.appendChild(currentlyWatchingContainerHeader);
    sectionElement.appendChild(profileVideoPaneAnimeGrid);
    sectionElement.appendChild(profileCurrentlyWatchingContainerHeaderExpand);

    section.appendChild(sectionElement);
  }

  for (const entry of sections) {
    const arr: any = await animeflix.getTrendingAnimeDeep(entry.getUrl(), entry.getType());
    const sectionElement = document.getElementById(`profile-section-${entry.getId()}`);

    if(sectionElement === null){
      return;
    }

    console.log("retrieved response from " + entry.getUrl());
  
    if(arr != undefined){
      loadItems(arr, "profile-video-pane-currently-" + entry.getId());
      sectionElement.style.backgroundImage = "none";
    }else{
      const containerElement = document.getElementById("profile-video-pane-currently-" + entry.getId());
      if (containerElement) {
        containerElement.style.opacity = '0';
      }
      sectionElement.remove();
      continue;
    }

    const watchingElement = document.getElementById('profile-video-pane-currently-'+ entry.getId());
    
    if (watchingElement === null) {
      return;
    }
    
    watchingElement.style.overflow = 'visible';
    watchingElement.style.height = 'auto';
  }


}



async function loadUserData() {

  discord.setChilling("the profile page");

  const page = document.getElementById('profile-page');

  if (page === null) {
    return;
  }

  const container = document.getElementById('profile-page-container');

  if(container === null){
    return;
  }

  
  //page.style.opacity = '0';
  container.style.backgroundImage = 'none';


  const loaded : boolean = await accountConnected();

  if(!loaded){
    shell.openExternal(authoriseUrl);
    State.updateState(<Search cached={false}/>);
    return;
  }

  await axios.get(authKeyUri);

  console.log("connected");

  await generateSections();

  page.style.opacity = '1';

  container.style.backgroundImage = 'none';
  
}

function loadItems(ids: any, container: string) {

  console.log(ids);

  const arr : any[] = ids.data.Page.media;

  console.log(ids.data);

  arr.forEach((data) => {

    const entry = data;
    

    if(entry.progress === undefined || entry.progress === null){
       entry.progress = 0;
    }

    //gets the next episode to watch, and if the episode is more than the total episodes, it will set it to the total episodes
    const episode = data.progress + 1 > entry.episodes ? entry.episodes : data.progress + 1;


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
    titleElement.textContent = entry.title.romaji;

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
    const containerElement = document.getElementById(container);
    containerElement?.appendChild(animeEntryElement);

    // // Add mouseover event listener to animeEntryElement
    // detailsElement.addEventListener('mouseover', function() {
    //   detailsElement.style.opacity = '1';
    // });

    // // Add mouseout event listener to animeEntryElement
    // detailsElement.addEventListener('mouseout', function() {
    //   detailsElement.style.opacity = '1';
    // });

    if(containerElement === null){	
      return;
    }
  
    containerElement.appendChild(animeEntryElement);

    detailsElement.addEventListener('mousedown', () => {
      // discord.setWatchingAnime(entry.title.romaji, parseInt(episode), entry.episodes, entry.coverImage.extraLarge);
      // animeflix.updateEpisodeForUser(entry, episode);

      const state = <Player entry={entry} episodeNumber={episode}/>;
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

  });

}

async function accountConnected() {
  try {
    const response = await axios.get(connectedUri);
    console.log(response.data);
    return (response.data);
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default function Hot1() {
 
  
  sideMenuUtils.toggle(document.getElementById('sidemenu-hot')!);

  // //syntexplayzhentai@gmail.com
  useEffect(() => {
    //shell.openExternal("https://anilist.co/api/v2/oauth/authorize?client_id=13194&redirect_uri=https://anilist.co/api/v2/oauth/pin&response_type=code");
    console.log("useEffect");
    loadUserData();
  });


  return (
     <div className='profile-page-container' id='profile-page-container'>
      <div className='profile-page' id='profile-page'>
          <div className='profile-video-pane'>
            <div className='profile-video-pane-currently-watching-container'/>
          </div>  
      </div>    
    </div>
  );
}
