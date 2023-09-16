
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

  entries?.forEach(async entry => {

    //get mode
    const modeSelect = document.getElementById('media2-mode') as HTMLInputElement;
    const mode = modeSelect.innerHTML;


    if(mode === 'SHOW_RESULTS_ON_NEW_WINDOW'){
        const url = `https://spankbang.com${entry.href}`;
        window.open(url, '_blank');
        return;
    }

    if(mode === 'SHOW_RESULTS_ON_PAGE_EMBED'){

      const url = `https://spankbang.com${entry.href}`;
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

      const url = `https://spankbang.com${entry.href}`;
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
        const url = `https://spankbang.com${entry.href}`;

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
    ],
    "template": [
      "none",
      "random0",
      "random1",
      "watchlater",
      "faphero",
      "rinxsen",
    ]
  };
  
  if(!nsfw){
    options = {
      "mode": [
        "SHOW_RESULTS_ON_PAGE",
        "SHOW_RESULTS_ON_NEW_WINDOW",
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