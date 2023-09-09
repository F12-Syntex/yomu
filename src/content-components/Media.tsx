
import * as sideMenuUtils from '../utils/SideMenu.ts';

import { useEffect } from 'react';
import * as animeflix from '../content-source/animeflix.ts';
import '../stylings/content/media.css';
import PlayerGeneric from './PlayerGeneric.tsx';
import ReactDOM from 'react-dom';
import * as State from '../core/State.ts';

export default function mediaPane() {  

  sideMenuUtils.toggle(document.getElementById('sidemenu-media')!);

  let nsfw = true;

  async function verifyAccount(){
    try{
      const account = await animeflix.getCurrentProfile();
      console.log(account);
      if(account.accountInformation.nsfw === false){
          sfw();
      }
    }catch(error){
      console.log(error);
      sfw();
    }
  }

  function sfw(){
    //add the generic player to the page
    // const searchGrid = document.getElementsByClassName('media-search-grid')[0] as HTMLDivElement;
    // ReactDOM.render(
    //   <PlayerGeneric url={"https://9anime.se/"} />,
    //   searchGrid.appendChild(document.createElement('div'))
    // );
    // // State.updateState(<PlayerGeneric url={"https://9anime.se/"} />);
    // // window.open('https://9anime.se/', '_blank');
    nsfw = false;
  }

  function randomNumber(min : number, max : number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async function playRandom(urls : string[]) {
    console.log(urls);

    const result_1: any[] = [];

    
    for (const url of urls) {
      
      const response = await fetch(url);
      const data = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      const elements = doc.getElementsByClassName('video-item');
      const result_2: any[] = [];

      Array.from(elements).forEach(element => {
        const link = element.querySelector('a');
        const img = element.querySelector('img');


        if (link && img) {
          if(link.getAttribute('href')?.includes('3d') || link.getAttribute('href')?.includes('sfm')){
            return;
          }
          const obj = {
            href: link.getAttribute('href'),
            dataSrc: img.getAttribute('data-src'),
            alt: img.getAttribute('alt')
          };
          result_2.push(obj);
        }
      });

      const results = result_2.splice(8);

      //add the results to the final array
      results.forEach(result => {
        result_1.push(result);
      });

    }

    const newArray: any[] = [];

    while (newArray.length < 10) {
      const randomElement = result_1[Math.floor(Math.random() * result_1.length)];
      if (!newArray.includes(randomElement)) {
        newArray.push(randomElement);
      }
    }

    return newArray;
  }

  async function getEntriesNsfw(query : string) {
    try {

      if(query.includes(':random0')){
        const urls = [
          `https://spankbang.com/s/hmv+hentai/${randomNumber(1, 15)}/?o=all`,
          `https://spankbang.com/s/hmv+hentai/${randomNumber(1, 15)}/?o=all`,
          `https://spankbang.com/s/hmv+hentai/${randomNumber(1, 15)}/?o=all`,
          `https://spankbang.com/s/hmv+hentai/${randomNumber(1, 15)}/?o=all`,
          `https://spankbang.com/s/hmv+hentai/${randomNumber(1, 15)}/?o=all`,
        ]
        const data = await playRandom(urls);
        return data;
      }



      if(query.includes(':random1')){
        const urls = [
          `https://spankbang.com/6g3u9/playlist/rin+x+sem`,
        ]
        const data = await playRandom(urls);
        return data;
      }

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

  async function getEntries(query : string) {
    //get random anime videos from the query
    return [];

  }

  // async function test(query : string) {
  //   try {
  //     const response = await fetch('https://spankbang.com/s/' + query.replace(' ', '%20') + '/');
  //     const data = await response.text();
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(data, 'text/html');

  //     const elements = doc.getElementsByClassName('video-item');
  //     const result_1: any[] = [];

  //     const obj1 = {
  //       href: "link.getAttribute('href')",
  //       dataSrc: "https://tbi.sb-cd.com/t/9007249/9/0/w:300/t6-enh/hmv-haven.jpg",
  //       alt: "hmv heaven"
  //     };

  //     const obj2 = {
  //       href: "link.getAttribute('href')",
  //       dataSrc: "https://tbi.sb-cd.com/t/12342700/1/2/w:300/t5-enh/hmv-pmv-your-body.jpg",
  //       alt: "hmv pmv your body"
  //     };

  //     result_1.push(obj1);
  //     result_1.push(obj2);


  //     return result_1;
  //   } catch (error) {
  //     // Handle any errors that occur during the API call
  //     console.error(error);
  //   }
  // }
  

  async function search(event: any){
    if(event.key === 'Enter'){
      const text = event.target.value;
      
      const searchGrid = document.getElementsByClassName('media-search-grid')[0] as HTMLDivElement;
      
      if(text.includes('-open')){
        const url = text.split('-open')[0].trim();
        console.log(url);
        
        State.updateState(<PlayerGeneric url={url}/>);
    }



      let entries : any[] | undefined;

      console.log(nsfw);

      if(nsfw == true){
        entries = await getEntriesNsfw(text);
      }else{
        entries = await getEntries(text);
      }


      console.log(entries);

      searchGrid.innerHTML = '';

      entries?.forEach(async entry => {
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

        if(text.startsWith(':random')){
          const url = `https://spankbang.com${entry.href}`;

          console.log(url);

          const response = await fetch(url);
          const data = await response.text();

          const embed : string = data.split('"embedUrl": "')[1].split('"')[0];
          
          //open the url in the browser
          //window.open(embed, '_blank');

          if(text.includes('-new')){

            //custom resolution
            //custom embed

            window.open(embed, '_blank');
          }else{
            ReactDOM.render(
              <PlayerGeneric url={embed} />,
              // document.querySelector('.media-search-grid')
              searchGrid.appendChild(document.createElement('div'))
            );
          }
          
          
        }else{
          
          
          box.addEventListener('click', async () => {
            const url = `https://spankbang.com${entry.href}`;
  
            const response = await fetch(url);
            const data = await response.text();
  
            const embed : string = data.split('"embedUrl": "')[1].split('"')[0];
  
            State.updateState(<PlayerGeneric url={embed}/>);
          });
  
          //add the box
          searchGrid.appendChild(box);
        }
        
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
