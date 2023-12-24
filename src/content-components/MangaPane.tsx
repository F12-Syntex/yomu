import { useEffect } from 'react';
import * as discord from '../content-source/discord-api.ts';
import '../stylings/content/mangaPane.css';
import * as sideMenu from '../utils/SideMenu.ts';
import { DidNavigateEvent, PageTitleUpdatedEvent } from 'electron';
import * as aniflix from '../content-source/animeflix.ts';
import * as actions from '../core/Actions.ts';
import * as SearchUtils from '../utils/SearchUtils.ts';

let lastMangaClicked: aniflix.AnilistMedia | null;
let lastManga: aniflix.Manga | null;

interface MangaPaneProps {
  url?: string;
}

export default function MangaPane({ url }: MangaPaneProps) {

  if(url === undefined) {
    url = 'https://mangafire.to/filter?keyword=&type%5B%5D=manhwa&type%5B%5D=manhua&genre%5B%5D=1&status%5B%5D=completed&language%5B%5D=en&minchap=50&sort=scores';
  }

  // const [iframeUrl, setIframeUrl] = useState("");

  // webFrame.on('did-navigate', (event, url) => {
  //   setIframeUrl(url);
  //   alert(url);
  // });

  // const ipc = require('electron').ipcRenderer;
  // ipc.send('open-manga-search');

  useEffect(() => {
      sideMenu.toggle(document.getElementById('sidemenu-mangaSearch')!);
      discord.setChilling(`${"manga view"}`);

      const webview = document.getElementById('mangapane-webview') as Electron.WebviewTag;

      if(webview === null) {
        return;
      }

      console.log(webview);

      const navigate = async (url: DidNavigateEvent) => {
        console.log('navigate: ' + url.url)
        actions.list.add(<MangaPane url={url.url}/>);

        

        if(!(url.url.includes('read') || url.url.includes('mangafire.to/manga'))){
            lastMangaClicked = null;
            lastManga = null;
            discord.setChilling(`${"manga view"}`);
            discord.setReadingTime(Date.now());
        }

        if(url.url.startsWith('https://mangafire.to/manga/')){
          //the user is reading a manga
          const name = url.url.split('/')[4].split('.')[0].replace(/-/g, ' ');

          //get information about the manga
          aniflix.searchManga(name).then((mangas: aniflix.AnilistMedia[]) => {
            lastMangaClicked = SearchUtils.findMostProbableManga(name, mangas) ?? mangas[0];
            console.log(">>> " + name + " " + lastMangaClicked.title.english);

            

            //update the discord status
            discord.BrowsingManga(lastMangaClicked);
          });
        }

        console.log(url.url);

        if(url.url.startsWith('https://mangafire.to/read/')){
          //the user is reading a manga
          const name = url.url.split('/')[4].split('.')[0].replace(/-/g, ' ');
          const chapter = url.url.split('/')[6].replace(/-/g, ' ').split('chapter-')[1];

          if(lastMangaClicked === undefined || lastMangaClicked === null){ 
            //get information about the manga
            const mangas = await aniflix.searchManga(name);
            lastMangaClicked = SearchUtils.findMostProbableManga(name, mangas) ?? mangas[0];
            console.log(">>> " + lastMangaClicked.title.english);
          }

          if(lastManga === undefined || lastManga === null){
            const record: Record<string, any> = {id: lastMangaClicked.id};
            lastManga = await aniflix.getMangaById(record);
          }

          if(lastManga === null || lastMangaClicked === null) return;

          //update the discord status
          let chapters = lastManga.chapters;

          discord.setWatchingManga(lastManga.title.native, parseFloat(chapter), chapters, lastManga.coverImage.extraLarge);
        }


      }

      const titleUpdated = (event: PageTitleUpdatedEvent) => {
        console.log('loadstart: ' + event.title)
        if(event.title.includes('Chapter') || event.title.includes('chapter')){

          let chapter = "";

          if(event.title.includes('Chapter')){
            chapter = event.title.split('Chapter ')[1].split(' ')[0];
          }else if(event.title.includes('chapter')){
            chapter = event.title.split('chapter ')[1].split(' ')[0];
          }

          console.log(`reading chapter: "${chapter}"`);

          if(lastManga === null || lastMangaClicked === null) return;

          //update the discord status
          let chapters = lastManga.chapters;
          discord.setWatchingMangaCached(lastManga.title.native, parseFloat(chapter), chapters, lastManga.coverImage.extraLarge);
          aniflix.updateChapterForUser(lastManga, chapter);
        }
      }

      webview.addEventListener('did-navigate', navigate)
      webview.addEventListener('page-title-updated', titleUpdated)
      
  }, []);
  
  return (
    <>
      <div id='mangapane-content'>
        <webview src={url} data-home={url} id='mangapane-webview'></webview>
      </div>
    </>
  );
}
