import axios from 'axios';
import { useEffect } from 'react';
import * as sideMenuUtils from '../utils/SideMenu.ts';
import * as State from '../core/State.ts';

import { shell } from 'electron';
import Search from './Search.tsx';

const endpoint = 'callback';
const port = `3023`;
const redirectUri = "http://localhost:" + port + "/" + endpoint;
const authKeyUri = "http://localhost:" + port + "/authenticate";
const connectedUri = "http://localhost:" + port + "/isConnected";
const planningUri = "http://localhost:" + port + "/getPlanningList";
const watchingUri = "http://localhost:" + port + "/getCurrentWatchingList";
const clientId = '13194';

const authoriseUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

import { MangaEntry } from '../content-source/mangakakalot.ts';
import MangaDetails from './MangaDetails.tsx';

import '../stylings/content/anilist.css';

async function loadUserData() {

  const loaded : boolean = await accountConnected();

  if(!loaded){
    shell.openExternal(authoriseUrl);
    State.updateState(<Search/>);
    return;
  }

  await axios.get(authKeyUri);

  console.log("connected");

  // const watchingGrid = document.querySelector('.anilist-watching');
  // const planningGrid = document.querySelector('.anilist-planning');

  // || planningGrid === null
  // if(watchingGrid === null){
  //   return;
  // }

  
  const response = await axios.get(watchingUri);
  const arr: any[] = response.data.data.MediaListCollection.lists[0].entries;

  // const response1 = await axios.get(planningUri);
  // const arr1: any[] = response1.data.data.MediaListCollection.lists[0].entries;

  loadItems(arr);
  // loadItems(arr1, ".anilist-planning");
  
}


function loadItems(ids: any[]) {

  ids.forEach((data) => {

    const entry = data.media;
    

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

    // Create h1 element with id 'profile-anime-entry-details'
    const detailsElement = document.createElement('h1');
    detailsElement.setAttribute('id', 'profile-anime-entry-details');
    detailsElement.textContent = 'CONTINUE FROM EPISODE 4';


    // Append child elements to their respective parents
    animeEntryContentElement.appendChild(titleElement);
    animeEntryContentElement.appendChild(detailsElement);
    animeEntryElement.appendChild(animeEntryHeaderElement);
    animeEntryElement.appendChild(animeEntryContentElement);

    animeEntryHeaderElement.style.backgroundImage = `url(${entry.coverImage.extraLarge})`;

    // Append the parent element to the desired container in your HTML document
    const containerElement = document.querySelector('.profile-video-pane-currently-watching');
    containerElement?.appendChild(animeEntryElement);

    // Add mouseover event listener to animeEntryElement
    animeEntryElement.addEventListener('mouseover', function() {
      //animeEntryHeaderElement.style.opacity = '0.8';
    });

    // Add mouseout event listener to animeEntryElement
    animeEntryElement.addEventListener('mouseout', function() {
      //animeEntryHeaderElement.style.opacity = '1';
    });

    if(containerElement === null){	
      return;
    }
  
    containerElement.appendChild(animeEntryElement);

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

export default function aniList() {
 
  
  sideMenuUtils.toggle(document.getElementById('sidemenu-anilist')!);

  // //syntexplayzhentai@gmail.com
  useEffect(() => {
    //shell.openExternal("https://anilist.co/api/v2/oauth/authorize?client_id=13194&redirect_uri=https://anilist.co/api/v2/oauth/pin&response_type=code");
    console.log("useEffect");
    loadUserData();
  });


  return (
    // <div className='authKeyInput'>
    //   <h1>Input AuthKey</h1>
    //   <textarea id='input' placeholder='AuthKey' value={authKey} onChange={handleInputChange}></textarea>
    //   <button onClick={handleSaveClick}>Submit</button>
    // </div>

    // <div className='anilist-container'>
    //     <div className='anilist-header'>
    //       <div className='anilist-watching-container'>
    //         <h1>Currently Watching</h1>
    //         <div className='anilist-grid-item anilist-watching'>
    //         </div>
    //       </div>
    //       <div className='anilist-planning-container'>
    //         <h1>Plan to watch</h1>
    //         <div className='anilist-grid-item anilist-planning'>
    //         </div>
    //     </div>
    //     </div>
    // </div>

    <>
     <div className='profile-page'>
        <div className='profile-banner'>
          <div className='profile-banner-img'>
              <h1 id='profile-banner-img-username'>
                Syntex
              </h1>
          </div>
        </div>
        <div className='profile-content'>
          <div className='profile-stats'>
            <div className='profile-stats-left'>
              <div className='profile-stats-left-darkborder'>
                <div className='profile-stats-total-anime'>
                  <h1 id='profile-stats-text-value'>32</h1>
                  <h1 id='profile-stats-text-parent'>Total anime</h1>
                </div>
                <div className='profile-stats-total-anime'>
                  <h1 id='profile-stats-text-value'>32</h1>
                  <h1 id='profile-stats-text-parent'>Total anime</h1>
                </div>
                <div className='profile-stats-total-anime'>
                  <h1 id='profile-stats-text-value'>32</h1>
                  <h1 id='profile-stats-text-parent'>Total anime</h1>
                </div>
                <div className='profile-stats-total-anime'>
                  <h1 id='profile-stats-text-value'>32</h1>
                  <h1 id='profile-stats-text-parent'>Total anime</h1>
                </div>
              </div>
              <div className='profile-icon-stats'>
                  <div className='profile-icon-component'>
                    {/* HOME SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" className='svg-home' viewBox="0 0 16 16">
                      <path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM13.991 3l.024.001a1.46 1.46 0 0 1 .538.143.757.757 0 0 1 .302.254c.067.1.145.277.145.602v5.991l-.001.024a1.464 1.464 0 0 1-.143.538.758.758 0 0 1-.254.302c-.1.067-.277.145-.602.145H2.009l-.024-.001a1.464 1.464 0 0 1-.538-.143.758.758 0 0 1-.302-.254C1.078 10.502 1 10.325 1 10V4.009l.001-.024a1.46 1.46 0 0 1 .143-.538.758.758 0 0 1 .254-.302C1.498 3.078 1.675 3 2 3h11.991zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2z"/>
                    </svg>
                    <div className='watch-time-stats'>
                      <h1 id='profile-stats-text-value-icon'>32</h1>
                      <h1 id='profile-stats-text-parent-icon'>Hours planned</h1>
                    </div>
                  </div>
                  <div className='profile-icon-component'>
                    {/* HOME SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" className='svg-home' viewBox="0 0 16 16">
                      <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5zm2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702s.18.149.5.149.5-.15.5-.15v-.7c0-.701.478-1.236 1.011-1.492A3.5 3.5 0 0 0 11.5 3V2h-7z"/>
                    </svg>
                    <div className='watch-time-stats'>
                      <h1 id='profile-stats-text-value-icon'>32</h1>
                      <h1 id='profile-stats-text-parent-icon'>Hours planned</h1>
                    </div>
                  </div>
              </div>
            </div>
            <div className='profile-stats-right'>
              <div className='profile-stats-right-darkborder'>
                <div className='profile-stats-total-anime'>
                  <h1 id='profile-stats-text-value'>32</h1>
                  <h1 id='profile-stats-text-parent'>Total anime</h1>
                </div>
                <div className='profile-stats-total-anime'>
                  <h1 id='profile-stats-text-value'>32</h1>
                  <h1 id='profile-stats-text-parent'>Total anime</h1>
                </div>
                <div className='profile-stats-total-anime'>
                  <h1 id='profile-stats-text-value'>32</h1>
                  <h1 id='profile-stats-text-parent'>Total anime</h1>
                </div>
                <div className='profile-stats-total-anime'>
                  <h1 id='profile-stats-text-value'>32</h1>
                  <h1 id='profile-stats-text-parent'>Total anime</h1>
                </div>
              </div>
              <div className='profile-icon-stats'>
              <div className='profile-icon-stats'>
                  <div className='profile-icon-component'>
                    {/* HOME SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" className='svg-home' viewBox="0 0 16 16">
                      <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                    </svg>
                    <div className='watch-time-stats'>
                      <h1 id='profile-stats-text-value-icon'>32</h1>
                      <h1 id='profile-stats-text-parent-icon'>Hours watched</h1>
                    </div>
                  </div>
                  <div className='profile-icon-component'>
                    {/* HOME SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" className='svg-home' viewBox="0 0 16 16">
                      <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
                      <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/>
                    </svg>
                    <div className='watch-time-stats'>
                      <h1 id='profile-stats-text-value-icon'>32</h1>
                      <h1 id='profile-stats-text-parent-icon'>Hours watched</h1>
                    </div>
                  </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        <div className='profile-video-pane'>
          <div className='profile-video-pane-currently-watching-container'>
            <h1>Continue Watching</h1>
            <div className='profile-video-pane-currently-watching'>
                {/* <div className='profile-anime-entry'>
                  <div className='profile-anime-entry-header'></div>
                  <div className='profile-anime-entry-content'>
                    <h1 id='profile-anime-entry-title'>KIMI NO NA WA</h1>
                    <h1 id='profile-anime-entry-details'>CONTINUE FROM EPISODE 4</h1>
                  </div>
                </div> */}
            </div>
          </div>
        </div>  
     </div>
    </>
  );
}
