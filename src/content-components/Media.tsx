
import * as sideMenuUtils from '../utils/SideMenu.ts';

import '../stylings/content/media.css';
import { useEffect } from 'react';
import * as animeflix from '../content-source/animeflix.ts';
import * as State from '../core/State.ts';
import PlayerGeneric from './PlayerGeneric.tsx';

export default function mediaPane() {  

  sideMenuUtils.toggle(document.getElementById('sidemenu-media')!);

  async function verifyAccount(){
    const account = await animeflix.getCurrentProfile();
    console.log(account.accountInformation.nsfw);
    if(account.accountInformation.nsfw === false){
        //clear the contents of this page, and display a message saying that the user needs to be 18+ to view this page
        const page = document.getElementById('media-page')!;
        page.innerHTML = '';
        const message = document.createElement('div');
        message.className = 'media-content-message';
        message.innerHTML = 'This page is not available for your account yet.';
        page.appendChild(message);
    }
  }


  async function getEntries(query : string) {
    try {
      const response = await fetch('https://spankbang.com/s/' + query.replace(' ', '%20') + '/');
      const data = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      const elements = doc.getElementsByClassName('video-item');
      const result_1: any[] = [];

      Array.from(elements).forEach(element => {
        const link = element.querySelector('a');
        const img = element.querySelector('img');

        if (link && img) {
          const obj = {
            href: link.getAttribute('href'),
            dataSrc: img.getAttribute('data-src'),
            alt: img.getAttribute('alt')
          };
          result_1.push(obj);
        }
      });
      return result_1.splice(8);
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error(error);
    }
  }

  async function test(query : string) {
    try {
      const response = await fetch('https://spankbang.com/s/' + query.replace(' ', '%20') + '/');
      const data = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      const elements = doc.getElementsByClassName('video-item');
      const result_1: any[] = [];

      const obj1 = {
        href: "link.getAttribute('href')",
        dataSrc: "https://tbi.sb-cd.com/t/9007249/9/0/w:300/t6-enh/hmv-haven.jpg",
        alt: "hmv heaven"
      };

      const obj2 = {
        href: "link.getAttribute('href')",
        dataSrc: "https://tbi.sb-cd.com/t/12342700/1/2/w:300/t5-enh/hmv-pmv-your-body.jpg",
        alt: "hmv pmv your body"
      };

      result_1.push(obj1);
      result_1.push(obj2);


      return result_1;
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error(error);
    }
  }
  

  async function search(event: any){
    if(event.key === 'Enter'){
      const text = event.target.value;
      
      const searchGrid = document.getElementsByClassName('media-search-grid')[0] as HTMLDivElement;
      

      const entries : any[] | undefined = await getEntries(text);
      console.log(entries);

      searchGrid.innerHTML = '';

      entries?.forEach(entry => {
        //create a box div for the result
        const box = document.createElement('div');
        box.className = 'media-search-grid-box';

        const img = document.createElement('div');
        img.className = 'media-search-grid-box-img';
        img.style.backgroundImage = `url(${entry.dataSrc})`;
        box.appendChild(img);

        const title = document.createElement('div');
        title.className = 'media-search-grid-box-title';
        title.innerHTML = `${entry.alt}`;
        box.appendChild(title);

        box.addEventListener('click', async () => {
          const url = `https://spankbang.com${entry.href}`;

          const response = await fetch(url);
          const data = await response.text();

          const embed : string = data.split('"embedUrl": "')[1].split('"')[0];

          //open the url in the player
          State.updateState(<PlayerGeneric url={embed}/>);
        });

        //add the box
        searchGrid.appendChild(box);
      });

    }
  }

  useEffect(() => {
    verifyAccount();
  }, []);

  return (
    <>
      <div className='media-content-search' id='media-page'>
          <div className='media-search-results'>
            <input type="text" id="media-search-input" name="search" placeholder="Search..." onKeyDown={search}></input>
          </div>
          <div className="media-search-grid"></div>
      </div>
    </>
  );
}
