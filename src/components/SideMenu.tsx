import Empty from '../content-components/Empty.tsx';
import Hot from '../content-components/Hot.tsx';
import MangaDetails from '../content-components/MangaDetails.tsx';
import { MangaEntry } from '../content-source/mangakakalot.ts';
import * as State from '../core/State.ts';

import '../stylings/content/sidemenu.css';


export function toggle(button: HTMLElement): void {
  const buttons = document.querySelectorAll('.sidemenu-button');

  console.log(button);
  
  for (let i = 0; i < buttons.length; i++) {
    const currentButton = buttons[i];
    if (currentButton === button) {
      continue;
    }

    currentButton.classList.remove('active-button');
    currentButton.classList.add('inactive-button');

    const selector = currentButton.querySelector('#' + currentButton.id + '-selector');
    selector?.classList.remove('sidemenu-button-selector-active');
    selector?.classList.add('sidemenu-button-selector-inactive');

    const img = currentButton.querySelector('#' + currentButton.id + '-img');
    img?.classList.remove(img?.id + '-active');
    img?.classList.add(img?.id +  '-inactive');
  }

  if (!button.classList.contains('active-button')) {

      button.classList.remove('inactive-button');
      button.classList.add('active-button');

      const selector = button.querySelector('#' + button.id + '-selector');
      selector?.classList.remove('sidemenu-button-selector-inactive');
      selector?.classList.add('sidemenu-button-selector-active');

      const img = button.querySelector('#' + button.id + '-img');
      img?.classList.remove(img?.id + '-inactive');
      img?.classList.add(img?.id +  '-active');

  } 
  /*else { 

      button.classList.remove('active-button');
      button.classList.add('inactive-button');

      const selector = button.querySelector('#' + button.id + '-selector');
      selector?.classList.remove('sidemenu-button-selector-active');
      selector?.classList.add('sidemenu-button-selector-inactive');

      const img = button.querySelector('#' + button.id + '-img');
      img?.classList.remove(img?.id + '-active');
      img?.classList.add(img?.id +  '-inactive');
  }*/

}

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

    // console.log(button);
    // State.updateState(<Search/>);

    const animeId : number = 1535; // Enen no Shouboutai
    const alt : string = 'Enen no Shouboutai';
    const img : string = 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-lawCwhzhi96X.jpg';

    const queryEntry: MangaEntry = {
      manga: {
        id: animeId,
        alt: alt,
        img: img,
      },
    };

    const state = <MangaDetails entry={queryEntry}/>;

    State.updateState(state);
  }

  function downloads() : void {
    const button = document.getElementById('sidemenu-downloads') as HTMLInputElement;
    if(button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Empty text="downloads"/>);
  }

  function settings() : void {
    const button = document.getElementById('sidemenu-settings') as HTMLInputElement;
    if(button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Empty text="settings"/>);

    // Open a new window with a specific size and position
    //windowMaker.openWindow("https://gotaku1.com/streaming.php?id=MTkzNDcw&title=Blue+Lock+Episode+1");

  }

  function hot() : void {
    const button = document.getElementById('sidemenu-hot') as HTMLInputElement;
    if(button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Hot/>);
  }
  
  return (
    <>
      <div id='sidemenu-container' className='sidemenu-container'>
          <div className='sidemenu-button' id='sidemenu-search' onClick={search}>
            <div className='sidemenu-button-selector sidemenu-button-selector-inactive' id='sidemenu-search-selector'></div>
            <div className='sidemenu-button-img sidemenu-search-img-inactive' id='sidemenu-search-img'></div>
          </div>
          <div className='sidemenu-button' id='sidemenu-hot' onClick={hot}>
            <div className='sidemenu-button-selector sidemenu-button-selector-inactive' id='sidemenu-hot-selector'></div>
            <div className='sidemenu-button-img sidemenu-hot-img-inactive' id='sidemenu-hot-img'></div>
          </div>
          <div className='sidemenu-button' id='sidemenu-downloads' onClick={downloads}>
            <div className='sidemenu-button-selector sidemenu-button-selector-inactive' id='sidemenu-downloads-selector'></div>
            <div className='sidemenu-button-img sidemenu-downloads-img-inactive' id='sidemenu-downloads-img'></div>
          </div>
          <div className='sidemenu-button' id='sidemenu-settings' onClick={settings}>
            <div className='sidemenu-button-selector sidemenu-button-selector-inactive' id='sidemenu-settings-selector'></div>
            <div className='sidemenu-button-img sidemenu-settings-img-inactive' id='sidemenu-settings-img'></div>
          </div>
      </div>  
    </>
  );
}


export default SideMenu;
