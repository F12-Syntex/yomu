import { useEffect } from 'react';
import * as discord from '../content-source/discord-api.ts';
import '../stylings/content/mangaPane.css';
import * as sideMenu from '../utils/SideMenu.ts';

interface MangaPaneProps {
  url?: string;
}

export default function playerGEneric({ url }: MangaPaneProps) {
  useEffect(() => {
      sideMenu.toggle(document.getElementById('sidemenu-mangaSearch')!);
      discord.setChilling(`${"manga view"}`);
      const webview = document.getElementById('mangapane-webview') as Electron.WebviewTag;
      if(webview === null) {
        return;
      }      
  }, []);
  
  return (
    <>
      <div id='mangapane-content'>
        <webview src={url} data-home={url} id='mangapane-webview'></webview>
      </div>
    </>
  );
}
