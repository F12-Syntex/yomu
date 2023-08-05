import AniList from '../content-components/AniList.tsx';
import Empty from '../content-components/Empty.tsx';
import Hot from '../content-components/Hot.tsx';
import Hot1 from '../content-components/Hot1.tsx';
import MangaPane from '../content-components/MangaPane.tsx';
import Search from '../content-components/Search.tsx';
import * as State from '../core/State.ts';

import '../stylings/content/sidemenu.css';

function SideMenu() {  

  //<div className='sidemenu-button' id='sidemenu-recent' onClick={recent}></div>

  /*
  let root: any = undefined;

  function updateContent(newElement: { type: any; props: any; } | null) {
    // Get the content element by its class name
    const contentElement = document.querySelector('.content');

    if(contentElement === null) {
      return;
    }

    if(newElement === null) {
      // Remove all children of the content element
      while (contentElement.firstChild) {
        contentElement.removeChild(contentElement.firstChild);
      }
      return;
    }
  
    // Create a new HTML element from the passed-in parameter
    const element = React.createElement(newElement.type, newElement.props);

    const rootElement = document.getElementById('content-source')!;

    if(root === undefined) {
      root = createRoot(rootElement);
    }

    root.render(element);
  }
  */
  

  
  function search() : void {
    const button = document.getElementById('sidemenu-search') as HTMLInputElement;
    if(button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Search/>);

    // const animeId : number = 1535; // Enen no Shouboutai
    // const alt : string = 'Enen no Shouboutai';
    // const img : string = 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-lawCwhzhi96X.jpg';

    // const queryEntry: MangaEntry = {
    //   manga: {
    //     id: animeId,
    //     alt: alt,
    //     img: img,
    //   },
    // };

    // const state = <MangaDetails entry={queryEntry}/>;

    // State.updateState(state);
  }

  function anilist() : void {
    const button = document.getElementById('sidemenu-anilist') as HTMLInputElement;
    if(button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<AniList/>);
  }

  function settings() : void {
    const button = document.getElementById('sidemenu-settings') as HTMLInputElement;
    if(button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Empty text="settings"/>);

    // Open a new window with a specific size and position
    //windowMaker.openWindow("https://gotaku1.com/streaming.php?id=MTkzNDcw&title=Blue+Lock+Episode+1");

  }

  function mangaSearch() : void {
    const button = document.getElementById('sidemenu-mangaSearch') as HTMLInputElement;
    if(button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<MangaPane/>);
  }

  function hot() : void {
    const button = document.getElementById('sidemenu-hot') as HTMLInputElement;
    if(button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Hot1/>);
  }
  
  return (
    <>
      <div id='sidemenu-container' className='sidemenu-container'>
          <div className='sidemenu-button' id='sidemenu-anilist' onClick={anilist}>
            <div className='sidemenu-button-selector sidemenu-button-selector-inactive' id='sidemenu-anilist-selector'></div>
            <div className='sidemenu-button-img sidemenu-anilist-img-inactive' id='sidemenu-anilist-img'></div>
          </div>
          <div className='sidemenu-button' id='sidemenu-search' onClick={search}>
            <div className='sidemenu-button-selector sidemenu-button-selector-inactive' id='sidemenu-search-selector'></div>
            <div className='sidemenu-button-img sidemenu-search-img-inactive' id='sidemenu-search-img'></div>
          </div>
          <div className='sidemenu-button' id='sidemenu-hot' onClick={hot}>
            <div className='sidemenu-button-selector sidemenu-button-selector-inactive' id='sidemenu-hot-selector'></div>
            <div className='sidemenu-button-img sidemenu-hot-img-inactive' id='sidemenu-hot-img'></div>
          </div>
          <div className='sidemenu-button' id='sidemenu-settings' onClick={settings}>
            <div className='sidemenu-button-selector sidemenu-button-selector-inactive' id='sidemenu-settings-selector'></div>
            <div className='sidemenu-button-img sidemenu-settings-img-inactive' id='sidemenu-settings-img'></div>
          </div>
          <div className='sidemenu-button' id='sidemenu-mangaSearch' onClick={mangaSearch}>
            <div className='sidemenu-button-selector sidemenu-button-selector-inactive' id='sidemenu-mangaSearch-selector'></div>
            <div className='sidemenu-button-img sidemenu-mangaSearch-img-inactive' id='sidemenu-mangaSearch-img'></div>
          </div>
      </div>  
    </>
  );
}


export default SideMenu;
