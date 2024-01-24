import axios from 'axios';
import { useEffect } from 'react';
import { Section } from '../anilist/Section.ts';
import * as animeflix from '../content-source/animeflix.ts';
import * as discord from '../content-source/discord-api.ts';
import * as State from '../core/State.ts';
import * as sideMenuUtils from '../utils/SideMenu.ts';


const endpoint = 'callback';
const port = `3023`;
const redirectUri = "http://localhost:" + port + "/" + endpoint;
const authKeyUri = "http://localhost:" + port + "/authenticate";
const connectedUri = "http://localhost:" + port + "/isConnected";
// const planningUri = "http://localhost:" + port + "/getPlanningList";
// const watchingUri = "http://localhost:" + port + "/getCurrentWatchingList";
// const statsUri = "http://localhost:" + port + "/getStatistics";
const clientId = '13194';

const authoriseUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

import { MangaEntry } from '../content-source/mangakakalot.ts';
import MangaDetails from './MangaDetails.tsx';

import '../stylings/content/anilist.css';
import MangaPane from './MangaPane.tsx';
import Player from './Player.tsx';
import UserChange from './UserChange.tsx';

async function generateSections(){

  const sections : Section[] = [
    new Section("Currently watching", "watching", "http://localhost:" + port + "/fetchList?status=CURRENT&media=ANIME", "TV"),
    new Section("Currently reading", "reading", "http://localhost:" + port + "/fetchList?status=CURRENT&media=MANGA", "MANGA"),
    new Section("Rewatching", "rewatching", "http://localhost:" + port + "/fetchList?status=REPEATING&media=ANIME", "TV"),
    new Section("Planning", "planning", "http://localhost:" + port + "/fetchList?status=PLANNING&media=ANIME", "TV"),
    new Section("Completed", "completed", "http://localhost:" + port + "/fetchList?status=COMPLETED&media=ANIME", "TV"),
    new Section("Paused", "paused", "http://localhost:" + port + "/fetchList?status=PAUSED&media=ANIME", "TV"),
    new Section("Dropped", "dropped", "http://localhost:" + port + "/fetchList?status=DROPPED&media=ANIME", "TV"),
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

    const profileHeaderLabelCollapseShow = document.createElement('h1');
    profileHeaderLabelCollapseShow.className = 'profile-header-label-collapse-show';
    profileHeaderLabelCollapseShow.id = `profile-header-label-show-more-${entry.getId()}`;
    profileHeaderLabelCollapseShow.textContent = 'Show more';
    profileCurrentlyWatchingContainerHeaderExpand.appendChild(profileHeaderLabelCollapseShow);

    const profileSvg: string = `
    <svg xmlns="http://www.w3.org/2000/svg" className='svg-home-small' fill='gray' viewBox="0 0 16 16" id='profile-svg-${entry.getId()}'>
      <path fill-rule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"/>
    </svg>
    `
    profileCurrentlyWatchingContainerHeaderExpand.innerHTML += profileSvg;

    sectionElement.appendChild(currentlyWatchingContainerHeader);
    sectionElement.appendChild(profileVideoPaneAnimeGrid);
    sectionElement.appendChild(profileCurrentlyWatchingContainerHeaderExpand);

    section.appendChild(sectionElement);
  } 

  for (const entry of sections) {
    const response = await axios.get(entry.getUrl());

    console.log("retrieving response from " + entry.getUrl() + " for " + entry.getId());
    console.log(response.data);
    const arr: any[] = response.data.data.MediaListCollection.lists[0]?.entries;

    const sectionElement = document.getElementById(`profile-section-${entry.getId()}`);

    if(sectionElement === null){
      return;
    }

    console.log("retrieved response from " + entry.getUrl());
  
    await getStats();
  
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

    const showMoreElement = document.getElementById(`profile-${entry.getId()}-container-header`);

    if(showMoreElement === null){
      return;
    }
    
    // Add a click event listener to the h1 element
    showMoreElement.addEventListener('mousedown', function() {
      const watchingElement = document.getElementById('profile-video-pane-currently-'+ entry.getId());
      const watchingElementButton = document.getElementById('profile-header-label-show-more-' + entry.getId());
      const icon = document.getElementById('profile-svg-' + entry.getId());

      console.log("clicked " + entry.getId());
    
      if (watchingElement === null || watchingElementButton === null || icon === null) {
        return;
      }
      
      if(watchingElement.style.overflow === 'visible'){
        watchingElement.style.overflow = 'hidden';
        watchingElement.style.height = '375px';
        watchingElementButton.textContent = 'Show more';

        icon.innerHTML = '<path fill-rule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"/>';
      }else{
        watchingElement.style.overflow = 'visible';
        watchingElementButton.textContent = 'Show less';
        watchingElement.style.height = 'auto';

        icon.innerHTML = '<path fill-rule="evenodd" d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"/>';
      }
  
  
    });

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
    const state = <UserChange/>;
    State.updateState(state);
    // shell.openExternal(authoriseUrl);
    // State.updateState(<Search/>);
    return;
  }

  // const pfp = document.getElementById('profile-avatar');
  // pfp?.addEventListener('mousedown', function() {
  //   const state = <UserChange/>;
  //   State.updateState(state);
  // });

  await axios.get(authKeyUri);

  console.log("connected");

  await generateSections();

  page.style.opacity = '1';

  container.style.backgroundImage = 'none';
  
}

async function getStats(){
  const stats = await animeflix.getUserStatistics();

  const animeStats = stats.data.Viewer.statistics.anime;

  const animeWatched = animeStats.count;
  const meanScore = animeStats.meanScore;
  const standardDeviation = animeStats.standardDeviation;
  const minutesWatched = animeStats.minutesWatched;
  const episodesWatched = animeStats.episodesWatched;
  const chaptersRead = animeStats.chaptersRead;
  const genres: any[] = animeStats.genres;
  const studios: any[] = animeStats.studios;
  const tags: any[]  = animeStats.tags;
  const voiceActors: any[] = animeStats.voiceActors;

  // Set anime watched value
  let animeWatchedElement = document.getElementById('profile-info-total-anime-value')!;
  animeWatchedElement.innerHTML = animeWatched || "0";

  // Set minutes watched value
  let minutesWatchedElement = document.getElementById('profile-info-minutes-watched-value')!;
  minutesWatchedElement.innerHTML = minutesWatched || "0";

  // Set episodes watched value
  let episodesWatchedElement = document.getElementById('profile-info-watched-episodes-value')!;
  episodesWatchedElement.innerHTML = episodesWatched || "0";

  // Set genres explored value
  let genresExploredElement = document.getElementById('profile-info-genres-explored-value')!;
  genresExploredElement.innerHTML = genres.length.toString();

  // Set mean score value
  let meanScoreElement = document.getElementById('profile-info-mean-score-value')!;
  meanScoreElement.innerHTML = meanScore || "0";

  // Set standard deviation value
  let standardDeviationElement = document.getElementById('profile-info-standard-deviation-value')!;
  standardDeviationElement.innerHTML = standardDeviation || "0";

  // Set chapters read value
  let chaptersReadElement = document.getElementById('profile-info-chapters-read-value')!;
  chaptersReadElement.innerHTML = chaptersRead || "0";

  // Set studios value
  let studiosValueElement = document.getElementById('profile-info-studios-value')!;
  studiosValueElement.innerHTML = studios.length.toString();

  // Set best genre value
  let bestGenreValueElement = document.getElementById('profile-info-best-genre-value')!;
  bestGenreValueElement.innerHTML = (genres[0] && genres[0].genre.genre) ? String(genres[0].genre.genre).toLowerCase() : "N/A";

  // Set favorite voice actor value
  let favoriteVoiceActorValueElement = document.getElementById('profile-info-favourite-voice-actor-value')!;
  favoriteVoiceActorValueElement.innerHTML = (voiceActors[0] && voiceActors[0].voiceActor.name.full) ? String(voiceActors[0].voiceActor.name.full).toLowerCase() : "N/A";

  // Set favorite tag value
  let favoriteTagValueElement = document.getElementById('profile-info-favourite-tag-value')!;
  favoriteTagValueElement.innerHTML = (tags[0] && tags[0].tag.name) ? String(tags[0].tag.name).toLowerCase() : "N/A";

  // Set favorite studio value
  let favoriteStudioValueElement = document.getElementById('profile-info-favourite-studio-value')!;
  favoriteStudioValueElement.innerHTML = (studios[0] && studios[0].studio.name) ? String(studios[0].studio.name) : "N/A";

  // Set profile banner background image
  let profileBannerElement = document.getElementById('profile-banner')!;

  // Set profile username
  let profileUsernameElement = document.getElementById('profile-banner-img-username')!;
  profileUsernameElement.textContent = stats.data.Viewer.name || "N/A";
  //profile-info

  animeflix.getCurrentProfile().then(async (profile) => {
  // Set profile avatar background image
  //if the image has already loaded then exit
  let profileAvatarElement = document.getElementById('profile-avatar')!;

  //print the background image
  console.log(profileAvatarElement.style.backgroundImage);

  if(profileAvatarElement.style.backgroundImage === "" || profileAvatarElement.style.backgroundImage === "url()" || profileAvatarElement.style.backgroundImage === "url('')" || profileAvatarElement.style.backgroundImage === undefined || profileAvatarElement.style.backgroundImage === null){
    if(profile.accountInformation.nsfw === true){

      profileAvatarElement.addEventListener('mousedown', async function() {
        const randomPfp = await animeflix.getRandomHentaiGif();
        const randomBanner = await animeflix.getRandomHentaiBanner();
  
        profileAvatarElement.style.backgroundImage = `url("${randomPfp}")`;
        profileBannerElement.style.backgroundImage = `url("${randomBanner}")`;

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
        pseudoElement.style.backgroundImage = `url("${randomPfp}")`;
        pseudoElement.style.backgroundSize = 'cover';
        pseudoElement.style.backgroundPosition = 'center';
        pseudoElement.style.backgroundRepeat = 'no-repeat';
        pseudoElement.style.imageRendering = '-webkit-optimize-contrast';
        
        root.appendChild(pseudoElement)

      });
    
      profileAvatarElement.style.cursor = 'pointer';


      //alert("NSFW");
      // profileAvatarElement.style.backgroundImage = 'url(' + "https://thehentaigif.com/wp-content/uploads/2020/10/23435761-73.gif" + ')';
      // profileAvatarElement.style.backgroundImage = 'url(' + "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD47GnkRAr06SRQE5kTXhquSQLb5rWfr9bQn-kAEHgaG-6m8ebOu449eZei3ifydEAO8s&usqp=CAU" + ')';
      //https://img3.gelbooru.com//images/b2/78/b2785201ff2dc9ed3276edfb01bcf79a.gif
      //https://img3.gelbooru.com//images/b2/78/b2785201ff2dc9ed3276edfb01bcf79a.gif
      //https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD47GnkRAr06SRQE5kTXhquSQLb5rWfr9bQn-kAEHgaG-6m8ebOu449eZei3ifydEAO8s&usqp=CAU
      // profileAvatarElement.style.backgroundImage = 'url(' + "https://img3.gelbooru.com//images/46/2b/462b17d2aa4ee47ada2f8b0488144c7b.gif" + ')';
      //https://img3.gelbooru.com//images/8e/c8/8ec8ff0b0352e6a5ad1c3a04eeeae981.gif
      //https://img3.gelbooru.com//images/4b/b9/4bb982cda74103466ac8c65daf154f7b.gif
      // profileAvatarElement.style.backgroundImage = 'url(' + "https://img3.gelbooru.com//images/8e/c8/8ec8ff0b0352e6a5ad1c3a04eeeae981.gif" + ')';   
      // profileAvatarElement.style.backgroundImage = 'url(' + "https://img3.gelbooru.com//images/4b/b9/4bb982cda74103466ac8c65daf154f7b.gif" + ')';
      // profileBannerElement.style.backgroundImage = 'url(' + "https://img3.gelbooru.com//images/4b/b9/4bb982cda74103466ac8c65daf154f7b.gif" + ')';

      // profileAvatarElement.style.backgroundImage = 'url(' + (stats.data.Viewer.avatar.large || "") + ')';
      // profileBannerElement.style.backgroundImage = 'url(' + (stats.data.Viewer.bannerImage || "") + ')';

      // profileAvatarElement.style.backgroundImage = 'url(' + (stats.data.Viewer.avatar.large || "") + ')';

      //https://thehentaigif.com/wp-content/uploads/2020/10/14760024-38.gif
      //https://thehentaigif.com/wp-content/uploads/2020/10/22628365-21.gif

      // const randomNumber1 = Math.floor(Math.random() * 129) + 1;
      // const randomNumber2 = Math.floor(Math.random() * 129) + 1;

      // profileAvatarElement.style.backgroundImage = `url("https://m1.imhentai.xxx/005/4wc2vzxntp/${randomNumber1}.gif")`;
      // profileBannerElement.style.backgroundImage = `url("https://m1.imhentai.xxx/005/4wc2vzxntp/${randomNumber2}.gif")`;


      // profileAvatarElement.style.backgroundImage = `url("https://m1.imhentai.xxx/005/4wc2vzxntp/14.gif")`;
      // profileBannerElement.style.backgroundImage = `url("https://m1.imhentai.xxx/005/4wc2vzxntp/115.gif")`;
      
      // animeflix.changeRootBackground("https://img3.gelbooru.com//images/4b/b9/4bb982cda74103466ac8c65daf154f7b.gif");

      let randomPfp = await animeflix.getRandomHentaiGif();
      let randomBanner = await animeflix.getRandomHentaiBanner();

      profileAvatarElement.style.backgroundImage = `url("${randomPfp}")`;
      profileBannerElement.style.backgroundImage = `url("${randomBanner}")`;

      console.log(profileAvatarElement.style.backgroundImage);
      console.log(profileBannerElement.style.backgroundImage);

      //#endregion
      // animeflix.changeRootBackground("https://m7.imhentai.xxx/024/ruixo5cvbh/3.jpg");


      profileAvatarElement.style.backgroundSize = 'cover';
      profileBannerElement.style.backgroundSize = 'cover';
      
    }else{
      profileAvatarElement.style.backgroundImage = 'url(' + (stats.data.Viewer.avatar.large || "") + ')';
      profileBannerElement.style.backgroundImage = 'url(' + (stats.data.Viewer.bannerImage || "") + ')';
    }
  }
});

}

/**
 * add items to the container
 * @param ids 
 * @param container 
 */
function loadItems(ids: any[], container: string) {

  ids.forEach((data) => {

    // console.log(data.progress + " : " + data.media.format);

    const entry = data.media;

    let progress = "";
    let continueFromString = data.media.format;
  
    if(data.media.format === "MANGA"){
      continueFromString = "CONTINUE FROM CHAPTER " + data.progress;
    }else{
      if(entry.episodes){
        progress = data.progress + 1 > entry.episodes ? entry.episodes : data.progress + 1;
      }else{
        progress = data.progress + 1;
      }
      continueFromString = "CONTINUE FROM EPISODE ";
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

    const maxLength : number = 50;

    if(titleElement.textContent != undefined && titleElement.textContent?.length > maxLength){
      //titleElement.style.fontSize = '1rem';
      titleElement.textContent = titleElement.textContent.substring(0, maxLength).trim() + '...';
    }

    // Create h1 element with id 'profile-anime-entry-details'
    const detailsElement = document.createElement('h1');
    detailsElement.setAttribute('id', 'profile-anime-entry-details');
    detailsElement.textContent = continueFromString + progress;

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

      if(data.media.format === "MANGA"){
        const url = "https://mangafire.to/filter?keyword=" + encodeURIComponent(entry.title.english) + "&minchap=" + progress;

        const state = <MangaPane url={url}/>;
        State.updateState(state);
      }else{
        const state = <Player entry={entry} episodeNumber={progress}/>;
        State.updateState(state);
      }

    });


    animeEntryElement.addEventListener('click', () => {

      if(data.media.format === "MANGA"){
        const url = "https://mangafire.to/filter?keyword=" + encodeURIComponent(entry.title.romaji) + "&minchap=" + progress;
        const state = <MangaPane url={url}/>;
        State.updateState(state);
      }else{
        const queryEntry: MangaEntry = {
          manga: {
            id:  entry.id,
            alt: entry.title.romaji,
            img: entry.coverImage.extraLarge,
          },
        };
  
        const state = <MangaDetails entry={queryEntry}/>;
  
        State.updateState(state);
      }

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


  function profileChange(){
    const state = <UserChange/>;
    State.updateState(state);
  }

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
     <div className='profile-page-container' id='profile-page-container'>
      <div className='profile-page' id='profile-page'>
          <div className='profile-banner' id='profile-banner'>
            <div className='profile-banner-img' id='profile-avatar'>
                <h1 id='profile-banner-img-username' onClick={profileChange}>
                  Syntex
                </h1>
            </div>
          </div>
          <div className='profile-content'>
            <div className='profile-stats'>
              <div className='profile-stats-left'>
                <div className='profile-stats-left-darkborder'>
                  <div className='profile-stats-total-anime'>
                    <h1 className='profile-stats-text-value' id='profile-info-mean-score-value'>32</h1>
                    <h1 className='profile-stats-text-parent'>Mean score</h1>
                  </div>
                  <div className='profile-stats-total-anime'>
                    <h1 className='profile-stats-text-value'  id='profile-info-standard-deviation-value'>32</h1>
                    <h1 className='profile-stats-text-parent'>Standard deviation</h1>
                  </div>
                  <div className='profile-stats-total-anime'>
                    <h1 className='profile-stats-text-value'  id='profile-info-chapters-read-value'>32</h1>
                    <h1 className='profile-stats-text-parent'>Chapters read</h1>
                  </div>
                  <div className='profile-stats-total-anime'>
                    <h1 className='profile-stats-text-value'  id='profile-info-studios-value'>32</h1>
                    <h1 className='profile-stats-text-parent'>Studios</h1>
                  </div>
                </div>
                <div className='profile-icon-stats'>
                    <div className='profile-icon-component'>
                      {/* HOME SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" className='svg-home' viewBox="0 0 16 16">
                        <path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM13.991 3l.024.001a1.46 1.46 0 0 1 .538.143.757.757 0 0 1 .302.254c.067.1.145.277.145.602v5.991l-.001.024a1.464 1.464 0 0 1-.143.538.758.758 0 0 1-.254.302c-.1.067-.277.145-.602.145H2.009l-.024-.001a1.464 1.464 0 0 1-.538-.143.758.758 0 0 1-.302-.254C1.078 10.502 1 10.325 1 10V4.009l.001-.024a1.46 1.46 0 0 1 .143-.538.758.758 0 0 1 .254-.302C1.498 3.078 1.675 3 2 3h11.991zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2z"/>
                      </svg>
                      <div className='watch-time-stats'>
                        <h1 className='profile-stats-text-value-icon' id='profile-info-total-anime-value'>32</h1>
                        <h1 className='profile-stats-text-parent-icon'>Watched anime</h1>
                      </div>
                    </div>
                    <div className='profile-icon-component'>
                      {/* HOME SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" className='svg-home' viewBox="0 0 16 16">
                        <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5zm2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702s.18.149.5.149.5-.15.5-.15v-.7c0-.701.478-1.236 1.011-1.492A3.5 3.5 0 0 0 11.5 3V2h-7z"/>
                      </svg>
                      <div className='watch-time-stats'>
                        <h1 className='profile-stats-text-value-icon' id='profile-info-minutes-watched-value'>32</h1>
                        <h1 className='profile-stats-text-parent-icon'>Minutes watched</h1>
                      </div>
                    </div>
                </div>
              </div>
              <div className='profile-stats-right'>
                <div className='profile-stats-right-darkborder'>
                  <div className='profile-stats-total-anime'>
                    <h1 className='profile-stats-text-value2' id='profile-info-best-genre-value'>32</h1>
                    <h1 className='profile-stats-text-parent'>Fav genre</h1>
                  </div>
                  <div className='profile-stats-total-anime'>
                    <h1 className='profile-stats-text-value2' id='profile-info-favourite-voice-actor-value'>32</h1>
                    <h1 className='profile-stats-text-parent'>Fav va</h1>
                  </div>
                  <div className='profile-stats-total-anime'>
                    <h1 className='profile-stats-text-value2' id='profile-info-favourite-tag-value'>32</h1>
                    <h1 className='profile-stats-text-parent'>Fav tag</h1>
                  </div>
                  <div className='profile-stats-total-anime'>
                    <h1 className='profile-stats-text-value2' id='profile-info-favourite-studio-value'>32</h1>
                    <h1 className='profile-stats-text-parent'>Fav studio</h1>
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
                          <h1 className='profile-stats-text-value-icon' id='profile-info-watched-episodes-value'>32</h1>
                          <h1 className='profile-stats-text-parent-icon'>Episodes watched</h1>
                        </div>
                      </div>
                      <div className='profile-icon-component'>
                        {/* HOME SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" className='svg-home' viewBox="0 0 16 16">
                          <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
                          <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/>
                        </svg>
                        <div className='watch-time-stats'>
                          <h1 className='profile-stats-text-value-icon' id='profile-info-genres-explored-value'>32</h1>
                          <h1 className='profile-stats-text-parent-icon'>Genres explored</h1>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='profile-video-pane'>
            <div className='profile-video-pane-currently-watching-container'/>
          </div>  
      </div>    
    </div>
    </>
  );
}
