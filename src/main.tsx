import React from 'react';
import ReactDOM from 'react-dom/client';
import SideMenu from './components/SideMenu.tsx';
import TitleBar from './components/TitleBar.tsx';
import './stylings/global/index.css';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className='yomu-background'>
      <div className="grid">
        <div className='titlebar'>
          <TitleBar/>
        </div>
        <div className='sidemenu'>
          <SideMenu/>
        </div>
        <div className='content' id='content-source'></div>
      </div>
    </div>
  </React.StrictMode>,
)

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