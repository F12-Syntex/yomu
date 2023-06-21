import { useEffect } from 'react';
import * as mangastream from '../content-source/mangakakalot.ts';
import * as sideMenu from '../components/SideMenu.tsx';
import * as searchPane from '../content-components/Search.tsx';
import '../stylings/content/search.css';

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

function search() {
    const searchGrid = document.querySelector('.search-grid');

    if (searchGrid === null) {
      return;
    }

    startLoadingAnimation();

    //call a js function asyncronously outside of this file
    mangastream.fetchRecent().then((entries) => {
      console.log(entries);
      searchPane.loadEntries(searchGrid, entries);
      
    })
}

export default function hot() {  

  sideMenu.toggle(document.getElementById('sidemenu-hot')!);

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

  useEffect(() => {
    search();
  }, []);

  return (
    <>
      <div className='content-search'>
          <div className="search-grid"></div>
      </div>
    </>
  );
  
}
