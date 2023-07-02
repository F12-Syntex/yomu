import { useEffect } from 'react';
import * as sideMenu from '../utils/SideMenu.ts';
import * as searchPane from '../content-components/Search.tsx';
import * as aniflix from '../content-source/animeflix.ts';

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

    aniflix.getTrendingAnime().then((entries) => {
      searchGrid.innerHTML = '';
      searchPane.loadEntries(searchGrid, entries);
    });


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
