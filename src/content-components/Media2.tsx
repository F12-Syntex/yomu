
import * as animeflix from '../content-source/animeflix.ts';
import * as discord from '../content-source/discord-api.ts';
import * as State from '../core/State.ts';
import * as sideMenuUtils from '../utils/SideMenu.ts';

import '../stylings/content/media2.css';


import { MenuItem, styled } from '@mui/material';

import TextField from '@mui/material/TextField';
import PlayerGeneric from './PlayerGeneric.tsx';
import ReactDOM from 'react-dom';

let query = "";

//TODO: add elements per page filter
//TODO: add element size option


let nsfw = true;

async function verifyAccount(){
  try{
    const account = await animeflix.getCurrentProfile();
    console.log(account);
    if(account.accountInformation.nsfw === false){
        nsfw = false;
    }
  }catch(error){
    console.log(error);
    nsfw = false;
  }
}

/**
 * clears the elements rendered on the search grid.
 * @returns 
 */
function clearGrid(){
  const searchGrid = document.querySelector('.media2-grid');

  if (searchGrid === null) {
    return;
  }

  searchGrid.innerHTML = '';
}

function startLoadingAnimation() {
  const searchGrid = document.querySelector('.media2-grid');

  if (searchGrid === null) {
    return;
  }

  clearGrid();

  const loading = document.createElement('div');
  loading.setAttribute('class', 'loading');
  searchGrid.appendChild(loading);
}

function search(event: any) {
  if (event.keyCode === 13) {
    searchAnime();
  }
}

async function loadGridMode(entries : any[] | undefined, ph : boolean, size : number){
  const root = document.getElementById('bg2');
  if (root !== null) {
    root.style.zIndex = '1';
    root.style.width = '99vw';
    root.style.height = '99vh'; // Adjust the height to half of the width for a perfect square
    root.style.display = 'grid';
    root.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // Use size for both columns and rows
    root.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    //clear roots children
    root.innerHTML = '';
  }else{
    return;
  }

  // Create div elements based on size x size
  const divs = [];
  for (let i = 0; i < size * size; i++) {
    const div = document.createElement('div');
    div.style.gridColumn = `${(i % size) + 1} / span 1`; // Calculate grid column dynamically
    div.style.gridRow = `${Math.floor(i / size) + 1} / span 1`; // Calculate grid row dynamically
    div.style.width = `${root.offsetWidth / size}px`; // Calculate width dynamically
    div.style.height = `${root.offsetHeight / size}px`; // Calculate height dynamically
    divs.push(div);
    root?.appendChild(div);
  }

  if (!entries || !root) return;

  //get the template
  const templateSelect = document.getElementById('media2-template') as HTMLInputElement;

  //get the value
  const template = templateSelect.innerHTML;

  //check if the template is hmv2
  if(template === 'hmv2'){
    const urls = [
      "https://spankbang.com/5zyf4/embed/", 
      "https://spankbang.com/4w7ln/embed/", 
      "https://spankbang.com/500aa/embed/", 
      "https://spankbang.com/8ux70/embed/", 
      ];

      
      //https://spankbang.com/8xvv4/video/hmv+elf+domination

        // Render React elements with URLs
        for (let i = 0; i < urls.length; i++) {
          ReactDOM.render(
            <PlayerGeneric url={urls[i]} />,
            divs[i]
          );
        }
        return;
  }



  // Assign URLs based on entries or fetch data
  let urls = [];
  if (ph) {
    urls = entries.slice(0, size * size).map(entry => entry.href);
  } else {
    for (let i = 0; i < size * size; i++) {
      const response = await fetch(`https://spankbang.com${entries[i].href}`);
      const data = await response.text();
      const embed = data.split('"embedUrl": "')[1].split('"')[0];
      urls.push(embed);
    }
  }

  // Render React elements with URLs
  for (let i = 0; i < size * size; i++) {
    ReactDOM.render(
      <PlayerGeneric url={urls[i]} />,
      divs[i]
    );
  }
}

async function searchAnime() {
  const searchGrid = document.querySelector('.media2-grid');

  if (searchGrid === null) {
    return;
  }

  startLoadingAnimation();

  discord.setSearching();

  const search_input = document.getElementById('media2-input') as HTMLInputElement;
  const search_text = search_input.value;
  query = search_text;
  
  let entries : any[] | undefined;

  console.log(nsfw);

  if(nsfw == true){
    entries = await getEntriesNsfw(query);
  }else{
    entries = await getEntries(query);
  }

  console.log(entries);

  searchGrid.innerHTML = '';

    //get mode
    const modeSelect = document.getElementById('media2-mode') as HTMLInputElement;
    const mode = modeSelect.innerHTML;

    const templateSelect = document.getElementById('media2-template') as HTMLInputElement;
    const template = templateSelect.innerHTML;
    //check if template has ph in it

    const ph = template.includes('ph');

    if (mode === "SHOW_RESULTS_ON_SPLIT_SCREEN_4") {
      loadGridMode(entries, ph, 2);
      return;
    }
    if (mode === "SHOW_RESULTS_ON_SPLIT_SCREEN_6") {
      loadGridMode(entries, ph, 3);
      return;
    }


  entries?.forEach(async entry => {

    if(mode === 'SHOW_RESULTS_ON_NEW_WINDOW'){
      let url = `https://spankbang.com${entry.href}`;

      if(ph){
        url = entry.href;
      }
        window.open(url, '_blank');
        return;
    }

    if(mode === 'SHOW_RESULTS_ON_PAGE_EMBED'){

      let url = `https://spankbang.com${entry.href}`;

      if(ph){
        url = entry.href;
        ReactDOM.render(
          <PlayerGeneric url={url} />,
          // document.querySelector('.media-search-grid')
          searchGrid.appendChild(document.createElement('div'))
        );
        return;
      }


      const response = await fetch(url);
      const data = await response.text();
      const embed : string = data.split('"embedUrl": "')[1].split('"')[0];

      //add the react elelemt
      ReactDOM.render(
        <PlayerGeneric url={embed} />,
        // document.querySelector('.media-search-grid')
        searchGrid.appendChild(document.createElement('div'))
      );
      return;
    }

    if(mode === 'SHOW_RESULTS_ON_PAGE_EMBED'){

      let url = `https://spankbang.com${entry.href}`;

      if(ph){
        url = entry.href;
        ReactDOM.render(
          <PlayerGeneric url={url} />,
          // document.querySelector('.media-search-grid')
          searchGrid.appendChild(document.createElement('div'))
        );
        return;
      }

      const response = await fetch(url);
      const data = await response.text();
      const embed : string = data.split('"embedUrl": "')[1].split('"')[0];

      //add the react elelemt
      ReactDOM.render(
        <PlayerGeneric url={embed} />,
        // document.querySelector('.media-search-grid')
        searchGrid.appendChild(document.createElement('div'))
      );
    }

    if(mode === 'SHOW_RESULTS_ON_PAGE'){
      //create a box div for the result
      const box = document.createElement('div');
      box.className = 'media2-search-grid-box';

      const img = document.createElement('div');
      img.className = 'media2-search-grid-box-img';
      img.style.backgroundImage = `url("${entry.dataSrc}")`;
      console.log(img.style.backgroundImage);
      box.appendChild(img);

      const title = document.createElement('div');
      title.className = 'media2-search-grid-box-title';
      title.innerHTML = `${entry.alt}`;
      box.appendChild(title);

      box.addEventListener('click', async () => {
        let url = `https://spankbang.com${entry.href}`;

        if(ph){
          url = entry.href;
          State.updateState(<PlayerGeneric url={url}/>);
          return;
        }

        const response = await fetch(url);
        const data = await response.text();

        const embed : string = data.split('"embedUrl": "')[1].split('"')[0];

        State.updateState(<PlayerGeneric url={embed}/>);
      });

      //add the box
      searchGrid.appendChild(box);
    }

  });

}

function randomNumber(min : number, max : number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function playRandomPH(urls : string[]) {

  const arr = [];

  //shuffle the array

  for(let i = 0; i < 30; i++){

    //grab random index 
    const index = randomNumber(0, urls.length - 1);

    const uri = urls[index].replace('https://www.pornhub.com/view_video.php?viewkey=', 'https://www.pornhub.com/embed/');

    const obj = {
      href: uri,
      dataSrc: "https://media.tenor.com/RHqfc1OG86sAAAAC/pornhub-logo.gif",
      alt: uri
    };
    arr.push(obj);
  }

  return arr;
}

async function playRandom(urls : string[]) {
  console.log(urls);

  const result_1: any[] = [];

  const MAX_ENTRIES = 30;

  
  for (const url of urls) {
    
    const response = await fetch(url);
    const data = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');

    const elements = doc.getElementsByClassName('video-item');
    const result_2: any[] = [];

    Array.from(elements).forEach(element => {
      const link = element.querySelector('a');
      const img = element.querySelector('img');


      if (link && img) {
        if(link.getAttribute('href')?.includes('3d') || link.getAttribute('href')?.includes('sfm')){
          return;
        }
        const obj = {
          href: link.getAttribute('href'),
          dataSrc: img.getAttribute('data-src'),
          alt: img.getAttribute('alt')
        };
        result_2.push(obj);
      }
    });

    const results = result_2.splice(8);

    //add the results to the final array
    results.forEach(result => {
      result_1.push(result);
    });

  }

  const newArray: any[] = [];

  let errors = 10;

  while (newArray.length < MAX_ENTRIES && errors > 0) {
    const randomElement = result_1[Math.floor(Math.random() * result_1.length)];
    if (!newArray.includes(randomElement)) {
      newArray.push(randomElement);
    }else{
      errors--;
    }
  }

  return newArray;
}

async function getEntriesNsfw(query : string) {
  try {
    const modeSelect = document.getElementById('media2-mode') as HTMLInputElement;
    const mode = modeSelect.innerHTML;

    const templateSelect = document.getElementById('media2-template') as HTMLInputElement;
    const template = templateSelect.innerHTML;

    console.log(mode, template);

    if (template === 'personalised'){
      const urls = [
        "https://spankbang.com/75iji/video/hmv+sex+sex", 
        "https://spankbang.com/5kql2/video/spires?utm_source=embed&utm_medium=player&utm_term=embed&utm_campaign=embed_play", 
        "https://spankbang.com/81evk/video/saimin+bp+hmv", 
        ];

        const data = await playRandom(urls);
        return data;
    }

    if(template === 'liked_ph2'){
      
      const urls = [
        "https://www.pornhub.com/view_video.php?viewkey=6534e2cdd2750", 
        "https://www.pornhub.com/view_video.php?viewkey=6534e2cdd2750", 
        "https://www.pornhub.com/view_video.php?viewkey=65267bd4d4c6a", 
        "https://www.pornhub.com/view_video.php?viewkey=65267bd4d4c6a", 
        ];

        const data = await playRandomPH(urls);
        return data;
    }

    if(template === 'liked_ph'){
      
      const urls = [
        "https://www.pornhub.com/view_video.php?viewkey=6534e2cdd2750", 
        "https://www.pornhub.com/view_video.php?viewkey=6534e2cdd2750", 
        "https://www.pornhub.com/view_video.php?viewkey=65267bd4d4c6a", 
        "https://www.pornhub.com/view_video.php?viewkey=65267bd4d4c6a", 
        "https://www.pornhub.com/view_video.php?viewkey=6486ea6836b49", 
        "https://www.pornhub.com/view_video.php?viewkey=6486ea6836b49", 
        "https://www.pornhub.com/view_video.php?viewkey=ph5fee329e2a1ca", 
        "https://www.pornhub.com/view_video.php?viewkey=ph5fee329e2a1ca", 
        "https://www.pornhub.com/view_video.php?viewkey=ph6398f37a7312f&pkey=291735961", 
        "https://www.pornhub.com/view_video.php?viewkey=ph63bcca63a7226&pkey=291674381", 
        "https://www.pornhub.com/view_video.php?viewkey=ph635c43ee182b0&pkey=sys:users:syntexuwu:favorites:newest", 
        "https://www.pornhub.com/view_video.php?viewkey=ph635c43ee182b0", 
        "https://www.pornhub.com/view_video.php?viewkey=ph635c43ee182b0", 
        "https://www.pornhub.com/view_video.php?viewkey=ph63b5bfad3db5b", 
        "https://www.pornhub.com/view_video.php?viewkey=ph63b5bfad3db5b", 
        "https://www.pornhub.com/view_video.php?viewkey=ph618454f5c4822", 
        "https://www.pornhub.com/view_video.php?viewkey=ph618454f5c4822",
        "https://www.pornhub.com/view_video.php?viewkey=ph6346ddd253536",
        "https://www.pornhub.com/view_video.php?viewkey=ph6346ddd253536",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ec080c6909c5",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ec080c6909c5",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cb1b8a615f41",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cb1b8a615f41",
        "https://www.pornhub.com/view_video.php?viewkey=ph62577c4d97071",
        "https://www.pornhub.com/view_video.php?viewkey=ph62577c4d97071",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f3fb1813d315",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f3fb1813d315",
        "https://www.pornhub.com/view_video.php?viewkey=ph6047da09a3e5c",
        "https://www.pornhub.com/view_video.php?viewkey=ph6047da09a3e5c",
        "https://www.pornhub.com/view_video.php?viewkey=ph5b7c5ca15106d",
        "https://www.pornhub.com/view_video.php?viewkey=ph5b7c5ca15106d",
        "https://www.pornhub.com/view_video.php?viewkey=ph602e8f5980dfc",
        "https://www.pornhub.com/view_video.php?viewkey=ph602e8f5980dfc",
        "https://www.pornhub.com/view_video.php?viewkey=ph60dbce7f13bef",
        "https://www.pornhub.com/view_video.php?viewkey=ph60dbce7f13bef",
        "https://www.pornhub.com/view_video.php?viewkey=ph5eb07d12f3113",
        "https://www.pornhub.com/view_video.php?viewkey=ph5eb07d12f3113",
        "https://www.pornhub.com/view_video.php?viewkey=ph5eb98e864bfaf",
        "https://www.pornhub.com/view_video.php?viewkey=ph5eb98e864bfaf",
        "https://www.pornhub.com/view_video.php?viewkey=ph60b3a508741be",
        "https://www.pornhub.com/view_video.php?viewkey=ph60b3a508741be",
        "https://www.pornhub.com/view_video.php?viewkey=ph605b776be7d04",
        "https://www.pornhub.com/view_video.php?viewkey=ph605b776be7d04",
        "https://www.pornhub.com/view_video.php?viewkey=ph6112cd6352ae7",
        "https://www.pornhub.com/view_video.php?viewkey=ph6112cd6352ae7",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fc932ebdf9c4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fc932ebdf9c4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5b253f445e9fa",
        "https://www.pornhub.com/view_video.php?viewkey=ph5b253f445e9fa",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e6e887279f8a",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e6e887279f8a",
        "https://www.pornhub.com/view_video.php?viewkey=ph60b7fb13b1787",
        "https://www.pornhub.com/view_video.php?viewkey=ph60b7fb13b1787",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e9169a170e06",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e9169a170e06",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f1ed68e9ccca",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f1ed68e9ccca",
        "https://www.pornhub.com/view_video.php?viewkey=ph5eeb1e92d4973",
        "https://www.pornhub.com/view_video.php?viewkey=ph5eeb1e92d4973",
        "https://www.pornhub.com/view_video.php?viewkey=ph603b59bbacfbb",
        "https://www.pornhub.com/view_video.php?viewkey=ph603b59bbacfbb",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fa3dd7d6cb4a",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fa3dd7d6cb4a",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f9c72f3c774f",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f9c72f3c774f",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d5d75e1e0171",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d5d75e1e0171",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f0ece68ec023",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f0ece68ec023",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c53cd2611029",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c53cd2611029",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ee10a21cbb45",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ee10a21cbb45",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fc8f38bd3d5f",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fc8f38bd3d5f",
        "https://www.pornhub.com/view_video.php?viewkey=ph5eff4a5884fd9",
        "https://www.pornhub.com/view_video.php?viewkey=ph5eff4a5884fd9",
        "https://www.pornhub.com/view_video.php?viewkey=ph6017be08d9ee2",
        "https://www.pornhub.com/view_video.php?viewkey=ph6017be08d9ee2",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fdf32e7bc9f0",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fdf32e7bc9f0",
        "https://www.pornhub.com/view_video.php?viewkey=ph5decd1170cd21",
        "https://www.pornhub.com/view_video.php?viewkey=ph5decd1170cd21",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fb95529e8fa5",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fb95529e8fa5",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c85f5c32a306",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c85f5c32a306",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f2683eced816",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f2683eced816",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d4a1cc44a1db",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d4a1cc44a1db",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f4eb77bcd3ca",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f4eb77bcd3ca",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f4ccf4bd19f2",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f4ccf4bd19f2",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fb04f993ebfd",
        "https://www.pornhub.com/view_video.php?viewkey=ph5fb04f993ebfd",
        "https://www.pornhub.com/view_video.php?viewkey=ph5b7a6b2b645f0",
        "https://www.pornhub.com/view_video.php?viewkey=ph5b7a6b2b645f0",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f7b877393273",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f7b877393273",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c20af64c0005",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c20af64c0005",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f72f4e32b58d",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f72f4e32b58d",
        "https://www.pornhub.com/view_video.php?viewkey=ph5a335abeb4cbc",
        "https://www.pornhub.com/view_video.php?viewkey=ph5a335abeb4cbc",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e5af07a158ef",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e5af07a158ef",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f9971520c3d7",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f9971520c3d7",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f7773815cd81",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f7773815cd81",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f689dcaf0a99",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f689dcaf0a99",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f6b7c4534074",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f6b7c4534074",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f5cc83418f84",
        "https://www.pornhub.com/view_video.php?viewkey=ph5f5cc83418f84",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e3c166fcf85a",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e3c166fcf85a",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e45894d2714e",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e45894d2714e",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d5d38e762c92",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d5d38e762c92", 
        "https://www.pornhub.com/view_video.php?viewkey=ph5da8ef0c5bd27",
        "https://www.pornhub.com/view_video.php?viewkey=ph5da8ef0c5bd27",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d6a6a597c45f",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d6a6a597c45f",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e90c3f82f23e",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e90c3f82f23e",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d30848d62c49",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d30848d62c49",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c3a217ec2d77",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c3a217ec2d77",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e6f9683c14ae",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e6f9683c14ae",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e4f06cb83fe3",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e4f06cb83fe3",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ef35fc3a692d",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ef35fc3a692d",
        "https://www.pornhub.com/view_video.php?viewkey=ph5be9a8dea78d6",
        "https://www.pornhub.com/view_video.php?viewkey=ph5be9a8dea78d6",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c0ded9402263",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c0ded9402263",
        "https://www.pornhub.com/view_video.php?viewkey=ph5debd81f8484b",
        "https://www.pornhub.com/view_video.php?viewkey=ph5debd81f8484b",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e5940c58f152",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e5940c58f152",
        "https://www.pornhub.com/view_video.php?viewkey=ph5de3be66b39b1",
        "https://www.pornhub.com/view_video.php?viewkey=ph5de3be66b39b1",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dc84b3907c86",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dc84b3907c86",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c8e730f1a2cd",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c8e730f1a2cd",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e3549e46be18",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e3549e46be18",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e773e473c649",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e773e473c649",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dc4483cd52d1",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dc4483cd52d1",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ddaaf4cc4c56",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ddaaf4cc4c56",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ed14b7ae58a6",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ed14b7ae58a6",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ee1030f81abb",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ee1030f81abb",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ea97625ce16b",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ea97625ce16b",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ea427b120bea",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ea427b120bea",
        "https://www.pornhub.com/view_video.php?viewkey=ph5eb28e2b06526",
        "https://www.pornhub.com/view_video.php?viewkey=ph5eb28e2b06526",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ea3a14b1b104",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ea3a14b1b104",
        "https://www.pornhub.com/view_video.php?viewkey=ph5edb8f4ec44f7",
        "https://www.pornhub.com/view_video.php?viewkey=ph5edb8f4ec44f7",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ec65c0c49fb2",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ec65c0c49fb2",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e4e6f4236392",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e4e6f4236392",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e272aee951a9",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e272aee951a9",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e247863a7d49",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e247863a7d49",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e8392c469943",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e8392c469943",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e7e6919576dc",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e7e6919576dc",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e7d5d94593e3",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e7d5d94593e3",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e8e1f10dbd35",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e8e1f10dbd35",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e654f357b032",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e654f357b032",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dfc2598d4271",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dfc2598d4271",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cd9a89454904",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cd9a89454904",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cb5ae2b9cae4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cb5ae2b9cae4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ce80e143f6cd",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ce80e143f6cd",
        "https://www.pornhub.com/view_video.php?viewkey=ph5da8dd3bc2d28",
        "https://www.pornhub.com/view_video.php?viewkey=ph5da8dd3bc2d28",
        "https://www.pornhub.com/view_video.php?viewkey=ph5db469785b2b0",
        "https://www.pornhub.com/view_video.php?viewkey=ph5db469785b2b0",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e19678207357",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e19678207357",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e498b785a1f7",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e498b785a1f7",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cd527872b236", 
        "https://www.pornhub.com/view_video.php?viewkey=ph5cd527872b236",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e41e0a2b3bd7",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e41e0a2b3bd7",
        "https://www.pornhub.com/view_video.php?viewkey=ph5a703818b07cb",
        "https://www.pornhub.com/view_video.php?viewkey=ph5a703818b07cb",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e4c5c8bebbf5",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e4c5c8bebbf5",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e4b83f7c37a3",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e4b83f7c37a3",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ca0b1a831141",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ca0b1a831141",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dd5bc76acda1",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dd5bc76acda1",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dceebcbcbac0",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dceebcbcbac0",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d8cca49b02a7",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d8cca49b02a7",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e185a7cc8be9",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e185a7cc8be9",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e21e9febae3b",
        "https://www.pornhub.com/view_video.php?viewkey=ph5e21e9febae3b",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dd827a90c4ab",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dd827a90c4ab",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dffc579be16d",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dffc579be16d",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d19cf37e7a09",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d19cf37e7a09",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d2c8d0a77be5",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d2c8d0a77be5",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dd0f97ea8ab4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5dd0f97ea8ab4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d59a818ef9dc",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d59a818ef9dc",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d8e7438bcec1",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d8e7438bcec1",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d4105c0e3245",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d4105c0e3245",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cab3538bff74",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cab3538bff74",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cac919662824",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cac919662824",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d57e6e1bcee4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d57e6e1bcee4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d33658122c27",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d33658122c27",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c82f21a38ed5",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c82f21a38ed5",
        "https://www.pornhub.com/view_video.php?viewkey=ph5b6deabf58b3a",
        "https://www.pornhub.com/view_video.php?viewkey=ph5b6deabf58b3a",
        "https://www.pornhub.com/view_video.php?viewkey=ph5bd22c93481f4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5bd22c93481f4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d3246261e721",
        "https://www.pornhub.com/view_video.php?viewkey=ph5d3246261e721",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c59d22464353",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c59d22464353",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cc9acf770958",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cc9acf770958",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cbb6a180178f",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cbb6a180178f",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ca9ebc94dfa8",
        "https://www.pornhub.com/view_video.php?viewkey=ph5ca9ebc94dfa8",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c1825979f9b3",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c1825979f9b3",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c94eeb5309f4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5c94eeb5309f4",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cf7d7c16c458",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cf7d7c16c458",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cb1d4d7f38da",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cb1d4d7f38da",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cc1fabf83519",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cc1fabf83519",
        "https://www.pornhub.com/view_video.php?viewkey=ph5be0967bc0fcc",
        "https://www.pornhub.com/view_video.php?viewkey=ph5be0967bc0fcc",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cad4cb02e6ce",
        "https://www.pornhub.com/view_video.php?viewkey=ph5cad4cb02e6ce",
        "https://ei.phncdn.com/www-static/css/premium/premium-modals.css?cache=2023111001", 
        ];

        const data = await playRandomPH(urls);
        return data;
    }

    if(template === 'DigitalFiend_ph'){
      
      const urls = [
        "https://www.pornhub.com/view_video.php?viewkey=ph63c3cd07c3fd9", 
        "https://www.pornhub.com/view_video.php?viewkey=ph63c3cd07c3fd9", 
        "https://www.pornhub.com/view_video.php?viewkey=64bd5bd10ccc8", 
        "https://www.pornhub.com/view_video.php?viewkey=64bd5bd10ccc8", 
        "https://www.pornhub.com/view_video.php?viewkey=ph5f2e014496710", 
        "https://www.pornhub.com/view_video.php?viewkey=ph5f2e014496710", 
        "https://www.pornhub.com/view_video.php?viewkey=6451ba12b6642", 
        "https://www.pornhub.com/view_video.php?viewkey=6451ba12b6642", 
        "https://www.pornhub.com/view_video.php?viewkey=ph6398f37a7312f&pkey=291736051", 
        "https://www.pornhub.com/view_video.php?viewkey=ph6398f37a7312f&pkey=291735961", 
        "https://www.pornhub.com/view_video.php?viewkey=654bbead672a5&pkey=sys%3Ausers%3ADigitalFiend%3Apublic%3Amr", 
        "https://www.pornhub.com/view_video.php?viewkey=654bbead672a5", 
        "https://www.pornhub.com/view_video.php?viewkey=654bbead672a5", 
        "https://www.pornhub.com/view_video.php?viewkey=64d3da5508d73", 
        "https://www.pornhub.com/view_video.php?viewkey=64d3da5508d73", 
        "https://www.pornhub.com/view_video.php?viewkey=64bec447a13d9",
        "https://www.pornhub.com/view_video.php?viewkey=64bec447a13d9",
        "https://www.pornhub.com/view_video.php?viewkey=64b481e4d346e",
        "https://www.pornhub.com/view_video.php?viewkey=64b481e4d346e",
        "https://www.pornhub.com/view_video.php?viewkey=64a9a316de465",
        "https://www.pornhub.com/view_video.php?viewkey=64a9a316de465",
        "https://www.pornhub.com/view_video.php?viewkey=64a050de3ee76",
        "https://www.pornhub.com/view_video.php?viewkey=64a050de3ee76",
        "https://www.pornhub.com/view_video.php?viewkey=6495ec91cff0b",
        "https://www.pornhub.com/view_video.php?viewkey=6495ec91cff0b",
        "https://www.pornhub.com/view_video.php?viewkey=6488df1e0a372",
        "https://www.pornhub.com/view_video.php?viewkey=6488df1e0a372",
        "https://www.pornhub.com/view_video.php?viewkey=6473effdc2de0",
        "https://www.pornhub.com/view_video.php?viewkey=6473effdc2de0",
        "https://www.pornhub.com/view_video.php?viewkey=6473860291196",
        "https://www.pornhub.com/view_video.php?viewkey=6473860291196",
        "https://www.pornhub.com/view_video.php?viewkey=646e7a6d75396",
        "https://www.pornhub.com/view_video.php?viewkey=646e7a6d75396",
        "https://www.pornhub.com/view_video.php?viewkey=645c36ded2f6b",
        "https://www.pornhub.com/view_video.php?viewkey=645c36ded2f6b",
        "https://www.pornhub.com/view_video.php?viewkey=6459caa05c91d",
        "https://www.pornhub.com/view_video.php?viewkey=6459caa05c91d",
        "https://www.pornhub.com/view_video.php?viewkey=6446d122321bc",
        "https://www.pornhub.com/view_video.php?viewkey=6446d122321bc",
        "https://www.pornhub.com/view_video.php?viewkey=6446cf8ab5cf8",
        "https://www.pornhub.com/view_video.php?viewkey=6446cf8ab5cf8",
        "https://www.pornhub.com/view_video.php?viewkey=6444691d7df48",
        "https://www.pornhub.com/view_video.php?viewkey=6444691d7df48",
        "https://www.pornhub.com/view_video.php?viewkey=644452374cf17",
        "https://www.pornhub.com/view_video.php?viewkey=644452374cf17",
        "https://www.pornhub.com/view_video.php?viewkey=6442b7ef3948b",
        "https://www.pornhub.com/view_video.php?viewkey=6442b7ef3948b",
        "https://www.pornhub.com/view_video.php?viewkey=6441d34a6356b",
        "https://www.pornhub.com/view_video.php?viewkey=6441d34a6356b",
        "https://www.pornhub.com/view_video.php?viewkey=6434e0930c3f0",
        "https://www.pornhub.com/view_video.php?viewkey=6434e0930c3f0",
        "https://www.pornhub.com/view_video.php?viewkey=64348d0021ea9",
        "https://www.pornhub.com/view_video.php?viewkey=64348d0021ea9",
        "https://www.pornhub.com/view_video.php?viewkey=64348da9b0bdd",
        "https://www.pornhub.com/view_video.php?viewkey=64348da9b0bdd", 
        "https://www.pornhub.com/view_video.php?viewkey=64347a62cdd75",
        "https://www.pornhub.com/view_video.php?viewkey=64347a62cdd75",
        ];

        const data = await playRandomPH(urls);
        return data;
    }

    if(template === 'random0'){
      const urls = [
        `https://spankbang.com/s/hmv+hentai/${randomNumber(1, 15)}/?o=all`,
        `https://spankbang.com/s/hmv+hentai/${randomNumber(1, 15)}/?o=all`,
        `https://spankbang.com/s/hmv+hentai/${randomNumber(1, 15)}/?o=all`,
        `https://spankbang.com/s/hmv+hentai/${randomNumber(1, 15)}/?o=all`,
        `https://spankbang.com/s/hmv+hentai/${randomNumber(1, 15)}/?o=all`,
      ]
      const data = await playRandom(urls);
      return data;
    }

    if(template === 'random1'){

      const urls = [
        `https://spankbang.com/s/hmv/${randomNumber(1, 5)}/?o=all`,
        `https://spankbang.com/9867w/playlist/2dpmv/${randomNumber(1, 5)}/?o=all`,
        `https://spankbang.com/8sz61/playlist/animehmv/${randomNumber(1, 5)}/?o=all`,
      ]
      const data = await playRandom(urls);
      return data;
    }

    if(template === 'random2'){

      const urls = [
        `https://spankbang.com/9an0u/playlist/hmv/${randomNumber(1, 5)}/?o=all`,
        `https://spankbang.com/6ip5y/playlist/hmv${randomNumber(1, 5)}/?o=all`,
        `https://spankbang.com/87gbf/playlist/hmv`
      ]
      const data = await playRandom(urls);
      return data;
    }

    if(template === 'watchlater'){

      const urls = [
        `https://spankbang.com/598ih/playlist/watch+later`,
        `https://spankbang.com/7k88d/playlist/watch+later`
      ]
      const data = await playRandom(urls);
      return data;
    }

    if(template === 'faphero'){

      const urls = [
        `https://spankbang.com/8pqxa/playlist/fapherorev`,
        `https://spankbang.com/7aj2m/playlist/fap+hero+3d+and+2d`,
        `https://spankbang.com/47nog/playlist/faphero`
      ]
      const data = await playRandom(urls);
      return data;
    }

    if(template === 'rinxsen'){
      const urls = [
        `https://spankbang.com/6g3u9/playlist/rin+x+sem`,
      ]
      const data = await playRandom(urls);
      return data;
    }

    if(template === 'hmv2'){

      const urls = [
        `https://spankbang.com/8xbp0/video/reina+hamazaki+hmv`,
        `https://spankbang.com/7amht/playlist/hmv`,
        `https://spankbang.com/9u5lv/playlist/hmv`,
        "https://spankbang.com/90433/video/hmv+kingdom+of+lust",
        "https://spankbang.com/8y46y/video/daddy+issues+hmv"
      ]
      const data = await playRandom(urls);
      return data;
    }

    const response = await fetch('https://spankbang.com/s/' + query.replace(' ', '%20') + '/');
    const data = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');

    const elements = doc.getElementsByClassName('video-item');
    const result_1: any[] = [];

    Array.from(elements).forEach(element => {
      const link = element.querySelector('a');
      const img = element.querySelector('img');

      if (link && img) {
        const obj = {
          href: link.getAttribute('href'),
          dataSrc: img.getAttribute('data-src'),
          alt: img.getAttribute('alt')
        };
        result_1.push(obj);
      }
    });
    return result_1.splice(8);
  } catch (error) {
    // Handle any errors that occur during the API call
    console.error(error);
  }
}

async function getEntries(query : string) {
  //get random anime videos from the query
  return [query];
}

const InputTextField = styled(TextField)({
  input: {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'gray',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
});

// Use the styled function to create a custom styled MenuItem component
const StyledMenuItem = styled(MenuItem)(() => ({
  backgroundColor: '#0F0000',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '0px',
  '&:hover': {
    backgroundColor: '#311A1E',
    color: 'white',
  },
  '&.Mui-selected': {
    backgroundColor: '#3F0D12',
    color: 'red',
    '&:hover': {
      backgroundColor: '#6F1016',
    },
  },
}));

function getOptions(){

  let options = {
    "mode": [
      "SHOW_RESULTS_ON_PAGE",
      "SHOW_RESULTS_ON_PAGE_EMBED",
      "SHOW_RESULTS_ON_NEW_WINDOW",
      "SHOW_RESULTS_ON_SPLIT_SCREEN_4",
      "SHOW_RESULTS_ON_SPLIT_SCREEN_6"
    ],
    "template": [
      "none",
      "random0",
      "random1",
      "watchlater",
      "faphero",
      "rinxsen",
      "liked_ph",
      "DigitalFiend_ph",
      "hmv2",
      "liked_ph2",
      "personalised"
    ]
  };
  
  if(!nsfw){
    options = {
      "mode": [
        "SHOW_RESULTS_ON_PAGE",
        "SHOW_RESULTS_ON_NEW_WINDOW",
        "SHOW_RESULTS_ON_SPLIT_SCREEN_4",
        "SHOW_RESULTS_ON_SPLIT_SCREEN_6"
      ],
      "template": [
        "DEFAULT",
      ]
    };
  }

  return options;

}

export default function SearchMenu() {

  discord.setSearching();

  sideMenuUtils.toggle(document.getElementById('sidemenu-media')!);

  verifyAccount();



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
  
  const mode = getOptions().mode;
  const template = getOptions().template;

  var defMode = mode[0];
  var defTemplate = template[0];

  return (
    <>
      <div className='content-search'>
        <div className='search-results'>
          {/* <input type="text" id="search-input" name="search" placeholder="Search..." onKeyDown={search}></input> */}
            <InputTextField
              className='double-width '
              id="media2-input"
              label="Search"
              name="email"
              onKeyDown={search}
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: 'gray' },
              }}
            />
          <InputTextField
            className='double-width2'
            id="media2-mode"
            select
            label="Mode"
            defaultValue={defMode}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'gray' },
            }}
          >
          {mode.map((option) => (
            <StyledMenuItem key={option} value={option}>
              {option}
            </StyledMenuItem>
          ))}
          </InputTextField> 
          <InputTextField
            className='search-generic-input'
            id="media2-template"
            select
            onBlur={searchAnime}
            label="Template"
            defaultValue={defTemplate}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'gray' },
            }}
          >
          {template.map((option) => (
            <StyledMenuItem key={option} value={option}>
              {option}
            </StyledMenuItem>
          ))}
          </InputTextField> 
        </div>
        <div className="media2-grid" id='search-search-grid'></div>
      </div>
    </>
  );
}