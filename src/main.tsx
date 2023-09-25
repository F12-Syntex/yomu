import React from 'react';
import ReactDOM from 'react-dom/client';
import SideMenu from './components/SideMenu.tsx';
import TitleBar from './components/TitleBar.tsx';

import './stylings/global/index.css';
import ModMenu from './content-components/modmenu/ModMenu.tsx';
import { render } from 'react-dom';


  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <div className='yomu-container'>
        <div className='yomu-background' id='yomu-bg'>
          <div className="grid">
            <div className='titlebar'>
              <TitleBar/>
            </div>
            {/* <div className='extra'></div> */}
            <div className='sidemenu'>
              <SideMenu/>
            </div>
            <div className='content' id='content-source'></div>
          </div>
        </div>
      </div>
    </React.StrictMode>,
  )

  if(console){
    document.addEventListener('keydown', (event) => {
      if(event.key === 'Tab') {

        event.preventDefault();

        //remove the element with the id of console and replace it with a new one
        const consoleElement = document.getElementById('console');
        if(consoleElement !== null) {
          consoleElement.remove();
          return;
        }
        const newConsoleElement = document.createElement('div');
        newConsoleElement.id = 'console';
        newConsoleElement.classList.add('console');


        document.querySelector('.content')?.appendChild(newConsoleElement);
        render(<ModMenu text='console'/>, newConsoleElement);
      } 
    });
  }



// const root = document.querySelector(':root');

// if(root !== null){
//   const pseudoElement = document.createElement('div');
//   pseudoElement.style.content = '""';
//   pseudoElement.style.position = 'absolute';
//   pseudoElement.style.top = '0';
//   pseudoElement.style.left = '0';
//   pseudoElement.style.width = '100%';
//   pseudoElement.style.height = '100%';
//   pseudoElement.style.zIndex = '-1';
//   pseudoElement.style.filter = 'blur(0px) brightness(5%)';
//   pseudoElement.style.backgroundSize = 'cover';
//   pseudoElement.style.backgroundPosition = 'center';
//   pseudoElement.style.backgroundRepeat = 'no-repeat';
//   pseudoElement.style.imageRendering = '-webkit-optimize-contrast';

//   pseudoElement.classList.add('yomu-background');
//   root.appendChild(pseudoElement)
// }


postMessage({ payload: 'removeLoading' }, '*')