import axios from 'axios';
import * as State from '../core/State.ts';

import { shell } from 'electron';
import Search from './Search.tsx';

const endpoint = 'callback';
const port = `3023`;
const redirectUri = 'http://localhost:' + port + '/' + endpoint;
const authKeyUri = 'http://localhost:' + port + '/authenticate';
const connectedUri = 'http://localhost:' + port + '/isConnected';
const planningUri = 'http://localhost:' + port + '/getPlanningList';
const watchingUri = 'http://localhost:' + port + '/getCurrentWatchingList';
const clientId = '13194';

const authoriseUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

import { MangaEntry } from '../content-source/mangakakalot.ts';
import MangaDetails from './MangaDetails.tsx';

import '../stylings/content/anilist.css';

async function loadUserData() {
  const loaded: boolean = await accountConnected();

  if (!loaded) {
    shell.openExternal(authoriseUrl);
    State.updateState(<Search />);
    return;
  }

  await axios.get(authKeyUri);

  console.log('connected');

  const watchingGrid = document.querySelector('.anilist-watching');
  const planningGrid = document.querySelector('.anilist-planning');

  if (watchingGrid === null || planningGrid === null) {
    return;
  }

  const response = await axios.get(watchingUri);
  const arr: any[] = response.data.data.MediaListCollection.lists[0].entries;

  const response1 = await axios.get(planningUri);
  const arr1: any[] = response1.data.data.MediaListCollection.lists[0].entries;

  loadItems(arr, '.anilist-watching');
  loadItems(arr1, '.anilist-planning');
}

function loadItems(ids: any[], id: string) {
  const watchingGrid = document.querySelector(id);

  if (watchingGrid === null) {
    return;
  }

  ids.forEach((data) => {
    const entry = data.media;

    const item = document.createElement('div');
    item.classList.add('anilist-item');

    const img = document.createElement('img');
    img.src = entry.coverImage.extraLarge;
    img.id = 'anilist-item-img';
    item.appendChild(img);

    const info = document.createElement('div');
    info.classList.add('anilist-item-info');

    const title = document.createElement('h2');
    title.id = 'anilist-item-title';
    title.textContent = entry.title.romaji;
    info.appendChild(title);

    item.appendChild(info);

    watchingGrid.appendChild(item);

    item.addEventListener('click', () => {
      const queryEntry: MangaEntry = {
        manga: {
          id: entry.id,
          alt: entry.title.romaji,
          img: entry.coverImage.extraLarge,
        },
      };

      const state = <MangaDetails entry={queryEntry} />;

      State.updateState(state);
    });
  });
}

async function accountConnected() {
  try {
    const response = await axios.get(connectedUri);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default function aniList() {
  // //syntexplayzhentai@gmail.com
  // useEffect(() => {
  //   //shell.openExternal("https://anilist.co/api/v2/oauth/authorize?client_id=13194&redirect_uri=https://anilist.co/api/v2/oauth/pin&response_type=code");
  //   loadUserData();
  // });

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
      <div className="profile-page">
        <div className="profile-banner">
          <div className="profile-banner-img">
            <h1 id="profile-banner-img-username">Syntex</h1>
          </div>
        </div>
        <div className="profile-content">
          <div className="profile-stats">
            <div className="profile-stats-left">
              <div className="profile-stats-left-darkborder">
                <div className="profile-stats-total-anime">
                  <h1 id="profile-stats-text-value">32</h1>
                  <h1 id="profile-stats-text-parent">Total anime</h1>
                </div>
                <div className="profile-stats-total-anime">
                  <h1 id="profile-stats-text-value">32</h1>
                  <h1 id="profile-stats-text-parent">Total anime</h1>
                </div>
                <div className="profile-stats-total-anime">
                  <h1 id="profile-stats-text-value">32</h1>
                  <h1 id="profile-stats-text-parent">Total anime</h1>
                </div>
                <div className="profile-stats-total-anime">
                  <h1 id="profile-stats-text-value">32</h1>
                  <h1 id="profile-stats-text-parent">Total anime</h1>
                </div>
              </div>
            </div>
            <div className="profile-stats-right">
              <div className="profile-stats-right-darkborder">
                <div className="profile-stats-total-anime">
                  <h1 id="profile-stats-text-value">32</h1>
                  <h1 id="profile-stats-text-parent">Total anime</h1>
                </div>
                <div className="profile-stats-total-anime">
                  <h1 id="profile-stats-text-value">32</h1>
                  <h1 id="profile-stats-text-parent">Total anime</h1>
                </div>
                <div className="profile-stats-total-anime">
                  <h1 id="profile-stats-text-value">32</h1>
                  <h1 id="profile-stats-text-parent">Total anime</h1>
                </div>
                <div className="profile-stats-total-anime">
                  <h1 id="profile-stats-text-value">32</h1>
                  <h1 id="profile-stats-text-parent">Total anime</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
