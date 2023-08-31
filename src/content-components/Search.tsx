
import * as animeflix from '../content-source/animeflix.ts';
import * as discord from '../content-source/discord-api.ts';
import * as State from '../core/State.ts';
import * as sideMenuUtils from '../utils/SideMenu.ts';

import { MangaEntry } from '../content-source/mangakakalot.ts';
import '../stylings/content/search.css';
import MangaDetails from './MangaDetails.tsx';


import { MenuItem, styled } from '@mui/material';
import TextField from '@mui/material/TextField';
import { shell } from 'electron';

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

function search(event: any) {

  if (event.keyCode === 13) {
    const searchGrid = document.querySelector('.search-grid');

    if (searchGrid === null) {
      return;
    }

    startLoadingAnimation();

    discord.setSearching();

    const search_input = document.getElementById('search-input') as HTMLInputElement;
    const search_text = search_input.value;

    //get the value from all the other inputs
    const season_select = document.getElementById('season-select') as HTMLInputElement;
    const season_text = season_select.innerHTML;

    const format_select = document.getElementById('format-select') as HTMLInputElement;
    const format_text = format_select.innerHTML;

    const airing_status_select = document.getElementById('airing-status-select') as HTMLInputElement;
    const airing_status_text = airing_status_select.innerHTML;

    const sorted_select = document.getElementById('sorted-select') as HTMLInputElement;

    //grab the key from the value of the select
    const sorted_text = Object.keys(Sort).find(key => Sort[key] === sorted_select.innerHTML);

    const nsfw_select = document.getElementById('nsfw-select') as HTMLInputElement;
    const nsfw_text = nsfw_select.innerHTML;

    const filtersURL = '&season=' + season_text + '&format=' + format_text + '&status=' + airing_status_text + '&sort=' + sorted_text + '&nsfw=' + nsfw_text;

    animeflix.search(search_text, filtersURL).then((entries) => {
      searchGrid.innerHTML = '';
      loadItems(entries, "search-search-grid");
    });

  }
}

function loadItems(ids: animeflix.AnimeQuery[], container: string) {

  ids.forEach((data) => {

    const entry = data;

    console.log(entry);
    

    if(entry.progress === undefined || entry.progress === null){
       entry.progress = 0;
    }

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
    detailsElement.textContent = 'VIEW ON ANILIST';

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
      const url = 'https://anilist.co/anime/' + data.id + '/';
      shell.openExternal(url);

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

// export async function loadEntries(searchGrid: Element, entries: animeflix.AnimeQuery[]) {

//   for (let i = 0; i < entries.length; i++) {
//     if (searchGrid !== null) {

//       const mangaEntry: { 
//         id: number;
//         title: {
//           romaji: string;
//           english: string;
//           native: string;
//         };
//         description: string;
//         coverImage: {
//           extraLarge: string;
//           color: string;
//         }
//       } = entries[i];

//       const img = document.createElement('div');
//       img.setAttribute('class', 'grid-item'); // add the class attribute
      
//       // Create a new Image object
//       const actualImg = new Image();
      
//       // Set the source of the actual image to the mangaEntry cover image
//       actualImg.src = mangaEntry.coverImage.extraLarge;
      
//       // Add an event listener to handle the load event of the actual image
//       actualImg.addEventListener('load', () => {
//         // When the actual image has finished loading, update the background image of the div
//         img.style.backgroundImage = `url(${actualImg.src})`;
//         img.style.backgroundSize = '20vw 35vh';
//       });

//       // create a details section for the grid item and add it to the image
//       const details = document.createElement('div');
//       details.setAttribute('class', 'grid-item-details');
//       img.appendChild(details);

//       console.log(mangaEntry.title.romaji);

//       // add a title to the details section
//       addMetaInfo(details, mangaEntry.title.romaji);


//       img.addEventListener('click', function() {
//         console.log(mangaEntry.id);

//         const queryEntry: MangaEntry = {
//           manga: {
//             id: mangaEntry.id,
//             alt: mangaEntry.title.romaji,
//             img: mangaEntry.coverImage.extraLarge,
//           },
//         };

//         const state = <MangaDetails entry={queryEntry}/>;

//         State.updateState(state);
//       });
    
//       searchGrid.appendChild(img); // append the new element to searchGrid
//     }
//   }


// }

const InputTextField = styled(TextField)({
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

const NsfwTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#510000',
    },
    '&:hover fieldset': {
      borderColor: 'red',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'red',
    },
  },
});

// Use the styled function to create a custom styled MenuItem component
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
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
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#6F1016',
    },
  },
}));


const Season: string[] = [
  'Winter',
  'Spring',
  'Summer',
  'Fall',
  'Any'
];

const Format: string[] = [
  'TV',
  'Movie',
  'TV Short',
  'Special',
  'OVA',
  'ONA',
  'Any'
];

const AiringStatus: string[] = [
  'Finished',
  'Releasing',
  'Not yet released',
  'Cancelled',
  'Hiatus',
  'Any'
];

const Adult: string[] = [
  'NSFW',
  'SFW',
  'Any'
];

// enum Sort {
//   None = "None",
//   START_DATE = "Start Date",
//   START_DATE_DESC = "Start Date (Descending)",
//   END_DATE = "End Date",
//   END_DATE_DESC = "End Date (Descending)",
//   SCORE = "Score",
//   SCORE_DESC = "Score (Descending)",
//   POPULARITY = "Popularity",
//   POPULARITY_DESC = "Popularity (Descending)",
//   TRENDING = "Trending",
//   TRENDING_DESC = "Trending (Descending)",
//   EPISODES = "Episodes",
//   EPISODES_DESC = "Episodes (Descending)",
//   DURATION = "Duration",
//   DURATION_DESC = "Duration (Descending)",
//   STATUS = "Status",
//   STATUS_DESC = "Status (Descending)"
// }

const descending = "↑";
const ascending = "↓";

const Sort: { [key: string]: string } = {
  "None": "None",
  "START_DATE": ascending + " Start Date",
  "START_DATE_DESC": descending + " Start Date",
  "END_DATE": ascending + " End Date",
  "END_DATE_DESC": descending + " End Date",
  "SCORE": ascending + " Score",
  "SCORE_DESC": descending + " Score",
  "POPULARITY": ascending + " Popularity",
  "POPULARITY_DESC": descending + " Popularity",
  "TRENDING": ascending + " Trending",
  "TRENDING_DESC": descending + " Trending",
  "EPISODES": ascending + " Episodes",
  "EPISODES_DESC": descending + " Episodes",
  "DURATION": ascending + " Duration",
  "DURATION_DESC": descending + " Duration",
  "STATUS": ascending + " Status",
  "STATUS_DESC": descending + " Status"
};


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
        <div className='search-results'>
          {/* <input type="text" id="search-input" name="search" placeholder="Search..." onKeyDown={search}></input> */}
            <InputTextField
              required
              id="search-input"
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
            id="season-select"
            select
            label="Season"
            defaultValue={"Any"}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'gray' },
            }}
          >
          {Season.map((option) => (
            <StyledMenuItem key={option} value={option}>
              {option}
            </StyledMenuItem>
          ))}
          </InputTextField> 
          <InputTextField
            id="format-select"
            select
            label="Format"
            defaultValue={"TV"}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'gray' },
            }}
          >
          {Format.map((option) => (
            <StyledMenuItem key={option} value={option}>
              {option}
            </StyledMenuItem>
          ))}
          </InputTextField> 
          <InputTextField
            id="airing-status-select"
            select
            label="Airing Status"
            defaultValue={"Any"}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'gray' },
            }}
          >
          {AiringStatus.map((option) => (
            <StyledMenuItem key={option} value={option}>
              {option}
            </StyledMenuItem>
          ))}
          </InputTextField> 
          <InputTextField
            id="sorted-select"
            select
            label="Sort"
            defaultValue={"None"}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'gray' },
            }}
          >
            {Object.keys(Sort).map((option) => (
              <StyledMenuItem key={option} value={option}>
                {Sort[option]}
              </StyledMenuItem>
            ))}
          </InputTextField>
          <NsfwTextField
            id="nsfw-select"
            select
            label="Adult Content"
            defaultValue={"SFW"}
            color='warning'
            InputProps={{
              style: { color: 'red' },
            }}
            InputLabelProps={{
              style: { color: 'red' },
            }}
          >
          {Adult.map((option) => (
            <StyledMenuItem key={option} value={option}>
              {option}
            </StyledMenuItem>
          ))}
          </NsfwTextField> 
        </div>
        <div className="search-grid" id='search-search-grid'></div>
      </div>
    </>
  );
}
