import AniList from '../content-components/AniList.tsx';
import Empty from '../content-components/Empty.tsx';
import Hot from '../content-components/Hot.tsx';
import Search from '../content-components/Search.tsx';
import * as State from '../core/State.ts';

// import icons
import { BsFillHouseFill } from 'react-icons/bs';
import { BsSearch } from 'react-icons/bs';
import { BsFire } from 'react-icons/bs';
import { BsGearFill } from 'react-icons/bs';

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

  function search(): void {
    const button = document.getElementById('search') as HTMLInputElement;
    if (button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Search />);

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

  function anilist(): void {
    const button = document.getElementById('anilist') as HTMLInputElement;
    if (button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<AniList />);
  }

  function settings(): void {
    const button = document.getElementById('settings') as HTMLInputElement;
    if (button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Empty text="settings" />);

    // Open a new window with a specific size and position
    //windowMaker.openWindow("https://gotaku1.com/streaming.php?id=MTkzNDcw&title=Blue+Lock+Episode+1");
  }

  function hot(): void {
    const button = document.getElementById('hot') as HTMLInputElement;
    if (button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Hot />);
  }

  return (
    <>
      <div className="sidemenu-container">
        <div className="button-container" id="anilist" onClick={anilist}>
          <div className="vanity-rectangle-of-deviously-obtuse-proportions"></div>
          <BsFillHouseFill className="icon"></BsFillHouseFill>
        </div>
        <div className="button-container" id="search" onClick={search}>
          <div className="vanity-rectangle-of-deviously-obtuse-proportions"></div>
          <BsSearch className="icon"></BsSearch>
        </div>
        <div className="button-container" id="hot" onClick={hot}>
          <div className="vanity-rectangle-of-deviously-obtuse-proportions"></div>
          <BsFire className="icon"></BsFire>
        </div>
        <div className="button-container" id="settings" onClick={settings}>
          <div className="vanity-rectangle-of-deviously-obtuse-proportions"></div>
          <BsGearFill className="icon"></BsGearFill>
        </div>
      </div>
    </>
  );
}

export default SideMenu;
