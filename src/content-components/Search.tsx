import React from 'react';

import * as animeflix from '../content-source/animeflix.ts';
import * as State from '../core/State.ts';
import * as sideMenuUtils from '../utils/SideMenu.ts';
import * as discord from '../content-source/discord-api.ts';

import '../stylings/content/search.css';
import MangaDetails from './MangaDetails.tsx';
import { MangaEntry } from '../content-source/mangakakalot.ts';

const hmv = false;

function addMetaInfo(details: HTMLElement, titleText: string){
      // add a title to the details section

      const hbox = document.createElement('div');
      hbox.setAttribute('class', 'hbox1');

      const container = document.createElement('div');
      container.setAttribute('class', 'grid-item-container');

      const title = document.createElement('div');
      title.setAttribute('class', 'grid-item-title');
      title.textContent = titleText; // set text content directly
      container.appendChild(title);

      console.log(">> " + titleText);

      hbox.appendChild(container);

      details.appendChild(hbox);
}

function startLoadingAnimation() {

  const searchGrid = document.querySelector('.search-grid');

  if (searchGrid === null) {
    return;
  }

  searchGrid.innerHTML = '';

  const loading = document.createElement('div');
  loading.setAttribute('class', 'loading');
  searchGrid.appendChild(loading);


}

function search(event: React.KeyboardEvent<HTMLInputElement>) {
  if (event.keyCode === 13) {
    const searchGrid = document.querySelector('.search-grid');

    if (searchGrid === null) {
      return;
    }

    startLoadingAnimation();

    discord.setSearching();


    const search_input = document.getElementById('search-input') as HTMLInputElement;
    const search_text = search_input.value;

    //call a js function asyncronously outside of this file
    //mangastream.fetchMangas(search_text).then((entries) => {
    //  loadEntries(searchGrid, entries);
    //});

    //search for data

    if (hmv) {
      animeflix.searchHmv(search_text);
    }

    animeflix.search(search_text).then((entries) => {
      searchGrid.innerHTML = '';
      loadEntries(searchGrid, entries);
    });


  }
}

export async function loadEntries(searchGrid: Element, entries: animeflix.AnimeQuery[]) {

  for (let i = 0; i < entries.length; i++) {
    if (searchGrid !== null) {

      const mangaEntry: { 
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
        }
      } = entries[i];

      const img = document.createElement('div');
      img.setAttribute('class', 'grid-item'); // add the class attribute
      
      // Create a new Image object
      const actualImg = new Image();
      
      // Set the source of the actual image to the mangaEntry cover image
      actualImg.src = mangaEntry.coverImage.extraLarge;
      
      // Add an event listener to handle the load event of the actual image
      actualImg.addEventListener('load', () => {
        // When the actual image has finished loading, update the background image of the div
        img.style.backgroundImage = `url(${actualImg.src})`;
        img.style.backgroundSize = '20vw 35vh';
      });

      // create a details section for the grid item and add it to the image
      const details = document.createElement('div');
      details.setAttribute('class', 'grid-item-details');
      img.appendChild(details);

      console.log(mangaEntry.title.romaji);

      // add a title to the details section
      addMetaInfo(details, mangaEntry.title.romaji);


      img.addEventListener('click', function() {
        console.log(mangaEntry.id);

        const queryEntry: MangaEntry = {
          manga: {
            id: mangaEntry.id,
            alt: mangaEntry.title.romaji,
            img: mangaEntry.coverImage.extraLarge,
          },
        };

        const state = <MangaDetails entry={queryEntry}/>;

        State.updateState(state);
      });
    
      searchGrid.appendChild(img); // append the new element to searchGrid
    }
  }


}



export default function SearchMenu() {  

  discord.setSearching();

  sideMenuUtils.toggle(document.getElementById('sidemenu-search')!);

  const items = document.querySelectorAll('.grid-item');
  items.forEach(item => {
    if (item.scrollHeight > item.clientHeight) {
      const overflowThreshold = item.clientHeight * 0.5; // set threshold to 50%
      item.addEventListener('scroll', () => {
        if (item.scrollTop > overflowThreshold) {
          item.classList.add('fading');
          item.classList.remove('visible');
        } else {
          item.classList.remove('fading');
          item.classList.add('visible');
        }
      });
    }
  });

  return (
    <>
      <div className='content-search'>
          <div id='search-results'>
            <input type="text" id="search-input" name="search" placeholder="Search..." onKeyDown={search}></input>
          </div>
          <div className="search-grid"></div>
      </div>
    </>
  );
}
