import React from 'react';
import ReactDOM from 'react-dom/client';
import SideMenu from './components/SideMenu.tsx';
import TitleBar from './components/TitleBar.tsx';

import './stylings/global/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="grid">
      <div className="titlebar">
        <TitleBar />t
      </div>
      <div className="sidemenu">
        <SideMenu />
      </div>
      <div className="content" id="content-source"></div>
    </div>
  </React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');
