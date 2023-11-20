import React, { useEffect, useState } from 'react';
import { nsfwIcons } from '../../components/TitleBar.tsx';
import './menu.css';

import ReactDOM from 'react-dom';
import * as aniflix from '../../content-source/animeflix.ts';
import PlayerGeneric from '../PlayerGeneric.tsx';

export default function ModMenu(props: { text: string }) {
  const [consoleInput, setConsoleInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConsoleInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.key === 'Enter') {
      handleExecuteAction();
      e.preventDefault();
    }
  };

  function changeBackground(input: string) {
    const root = document.getElementById('yomu-bg');
    const arr = input.split(' ');

    if(arr.length < 2) {
      logError('Please specify a background image');
      return;
    }

    if(root !== null) {
      root.style.backgroundImage = `url(${arr[1]})`;
      root.style.backgroundSize = 'cover';
      root.style.backgroundPosition = 'center';
    }

    logSuccess('Background changed');
    
  }

  function logInput(input: string, commandToRun?: string){
    logWithColour(input, 'green', commandToRun);
  }

  function logError(input: string, commandToRun?: string){
    logWithColour(input, 'red', commandToRun);
  }

  function logSuccess(input: string, commandToRun?: string){
    logWithColour(input, 'white', commandToRun);
  }

  let intervalId : any; // Declare a variable to store the interval ID

  async function changeImage() {
    const root = document.getElementById('bg2');

    const randomImg = await aniflix.getRandomHentaiGif();

    //add a new image element to the root
    const img = document.createElement('img');
    img.src = randomImg;
    img.style.position = 'absolute';
    img.style.top = '0px';
    img.style.left = '0px';
    img.style.width = 'auto';
    img.style.height = '100vh';
    img.style.zIndex = '1';
    img.style.border = 'none';

    //get all of roots current children ecluding the last child
    const children = root?.children;

    //append the new image to the root

    root?.appendChild(img);

    if(children !== undefined) {
      for(let i = 0; i < children.length - 2; i++) {
        const child = children[i];
        root?.removeChild(child);
      }
    }

  }
  
  function startImageChange() {

    //if an interval exist stop it then do nothing
    if(intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
      return;
    }

    //start the interval
    intervalId = setInterval(changeImage, 1000);
  }

  async function handleCommand(cmd : string){

    //print console log into the screen as the user types some kind of commands
    if(cmd.includes('cbg')) {
      changeBackground(cmd);
      return;
    }

    if(cmd.includes('clear') || cmd.includes('cls')) {
      const consoleHistory = document.querySelector('.console-history');
      if(consoleHistory !== null) {
        consoleHistory.innerHTML = '';
      }
      return;
    }

    if(cmd.startsWith('hide')) {
      const sideMenu = document.getElementById('sidemenu-container');
      if(sideMenu){
        if(sideMenu.style.opacity === '0') {
          sideMenu.style.opacity = '1';
          logSuccess('Side menu is now visible', 'hide');
        }else{
          sideMenu.style.opacity = '0';
          logError('Side menu is now hidden', 'hide');
        }
      }
      return;
    }

    if(cmd.startsWith('hmv')) {

      const account = await aniflix.getCurrentProfile();
      if(!account.accountInformation.nsfw){
        logError('This command can only be run on nsfw accounts.');
        return;
      } 

      if(cmd.split(' ')[1] === 'list'){

        const templates = ['saturation', 'saturation2', 'contrast', 'disco', 'default', 'neon', 'neon_light', 'glitch', 'hardcore'];

        for(let i = 0; i < templates.length; i++){
          logWithColour("hmv 1 " + templates[i] + " 40", 'white', "hmv 1 " + templates[i] + " 40");
        }
        for(let i = 0; i < templates.length; i++){
          logWithColour("hmv 1.2 " + templates[i] + " 50", 'white', "hmv 1.2 " + templates[i] + " 50");
        }
        
        logWithColour("hmv 2 glitch 50", 'white', "hmv 2 glitch 50");

        return;
      }



      let urls1 = [
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Epsil0n-Playing-With-Airi-Part-3.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_hmvhero69-HMV014-Idiom-Girl-Part-3.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_IUIO-HMV.8-B-DAY.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_AnoanHMV-Lusty-Remedy.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_hmvhero69-COL001-The-Spire.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_EternalHMV-PARADISE-LOST.mp4",
        "https://hentaiprn.xyz/videos/HMV/Netokano%20-%20HMV.mp4",
        "https://hentaiprn.xyz/videos/HMV/I%20Love%20Milfs%20Remaster.m4v",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_suikeai-Dried-senbei.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_dirt-Fun-with-Dark-Elves.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_crav_on-Fat-Ass-Bitches.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Ding-Ding-All-the-Rich-Girls-Said.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Somatic-Super-Slut-Alert.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_hakueee-Just-Like-A-Pill.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_IseJK-Broke-my-mind.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_TheDraigc-Rented-Wife.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_OPPAIXXX0-MAGICAMI-DX-HMV-3.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Hibootys-Sugar-daddy-part-2.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_zzbusio-MISAKO-TSUKAMATO-vs-HISATO-AZUMA.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Ashton-Enticing-Elves.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Moosashi-Holy-Dark-Elves.mp4",
        "https://hmvmania.com/wp-content/uploads/2022/04/mp4/anoan/hmv_720p_%5BAnoanHMV%5D%20Elves%20are%20for%20Lewd%20II.mp4",
        "https://hmvmania.com/wp-content/uploads/2022/04/mp4/anoan/hmv_720p_%5BAnoanHMV%5D%20Elves%20are%20for%20Lewd%20VIII.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Ashton-Erotic-Elves.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_dirt-Cum-Dumps-in-Space.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_HarrisZERO117556-Pandra-Shinkyoku-no-Grimoire.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_ArtsPexx-Hentai-Love.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_Kiraah-Crusade.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Babatiks-Slice-Me-Nice.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_Towa-Acid-Burst.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_Albinohawk-All-That-I-Need2020.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_Franmak-RinX.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Ding-Ding-Sweet-Ring.mp4",
        "https://hmvmania.com/wp-content/uploads/2022/07/mp4/ember/hmv_1080p_%5Bember%5D%20Bring%20It.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/12/mp4/hmv_1080p_%5BSeaGeGe%5D%20Princess%20Alicia.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/11/nov12_21/nov12_batch_hmv_1080p_EternalHMV_BROKEN%20PRINCESS%20REMAKE.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/08/hmv_720p_TheBrokenFacade_Plz%20Grape%20Me.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Hentaku-Gimme-More-Hentai-Mommy.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Babatiks-Slice-Me-Nice.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_720p_Albinohawk-Tempted-Diaries-2022.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Nanimari-Hentai-Explosion.mp4",
        "https://hmvmania.com/wp-content/uploads/2021/01/hmv_1080p_Goblin-Lord-Rip-Mother.mp4",
      ];

      const urls = aniflix.getHmvList();

      if(cmd.split(' ')[1] === 'n'){

        //pick 10 random urls
        const randomUrls : string[] = [];

        for(let i = 0; i < 1; i++){
          const randomIndex = Math.floor(Math.random() * urls.length);
          const url = urls[randomIndex];
          randomUrls.push(url);
        }

        //for every url, create a new window and play the video
        for(let i = 0; i < randomUrls.length; i++){
          const url = randomUrls[i];
          const win = window.open('_blank');
          win?.focus();

          // Create a video element
          const videoElement = document.createElement('video');
          videoElement.src = url;
          videoElement.controls = true;

          // Modify the style of the video element
          videoElement.style.width = '100%';
          videoElement.style.height = 'auto';
          videoElement.style.position = 'absolute';
          videoElement.style.top = '-10px';
          videoElement.style.left = '-10px';
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.zIndex = '-1';
          videoElement.style.border = 'none';
          videoElement.style.filter = `brightness(0%) saturate(200%)`;

          // Append the video element to the document body of the newly opened window
          win?.document.body.appendChild(videoElement);
          alert(win?.document.body.innerHTML);

          //show the video
          videoElement.play();
        }

        return;
      }

      const playback_speed : number = parseInt(cmd.split(' ')[1] ?? 1);
      const template = cmd.split(' ')[2] ?? 'default';
      const brightness = cmd.split(' ')[3] ?? 20;

      const randomIndex = Math.floor(Math.random() * urls.length);
      const url = urls[randomIndex];

      const videoElement = document.createElement('video');

      videoElement.src = url;
      videoElement.autoplay = true;
      videoElement.playbackRate = playback_speed; // Set the playback rate to 2x

      if(template === 'saturation'){
        videoElement.style.filter = `brightness(${brightness}%) saturate(200%)`; 
      }

      if(template === 'saturation2'){
        videoElement.style.filter = `brightness(${brightness}%) saturate(300%)`; 
      }

      if(template === 'contrast'){
        videoElement.style.filter = `brightness(${brightness}%) contrast(120%)`; 
      }

      if(template === 'disco'){
        videoElement.style.filter = `brightness(${brightness}%) saturate(200%) contrast(200%)`;
      }

      if (template === 'neon') {
        videoElement.style.filter = `brightness(${brightness}%) saturate(200%) contrast(150%)`;
      }

      if (template === 'neon_light') {
        videoElement.style.filter = `brightness(${brightness}%) saturate(120%) contrast(130%) drop-shadow(0 0 10px #00ff00)`;
      }

      if (template === 'hardcore') {
        videoElement.style.filter = `brightness(${brightness}%) saturate(300%) contrast(200%)`;
        videoElement.style.animation = 'hardcoreEffect 0.5s infinite';
      }
    
      if (template === 'glitch') {
        videoElement.id = 'glitchEffect';
      }

      if(template === 'default'){
        videoElement.style.filter = `blur(0px) brightness(${brightness}%)`;
      }


      
      videoElement.style.position = 'absolute';
      videoElement.style.top = '-10px';
      videoElement.style.left = '-10px';
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.zIndex = '-1';
      videoElement.style.border = 'none';
      videoElement.classList.add('yomu-background');
      
      document.body.appendChild(videoElement);
      

      const element : HTMLElement | null = document.querySelector('.yomu-background');
      
      if(element){

        //remove all childrem with the class yomu-background
        const children = element.querySelectorAll('.yomu-background');
        children.forEach(child => {
          element.removeChild(child);
        });

        element.appendChild(videoElement);
      }

      logSuccess('Playing HMV: ' + url, 'hmv ' + playback_speed + ' ' + template);

      return;
    }

    //rchange icons
    if(cmd.startsWith('ris')) {
      const account = await aniflix.getCurrentProfile();
      if(!account.accountInformation.nsfw){
        logError('This command can only be run on nsfw accounts.');
        return;
      } 

      const id = cmd.split(' ')[1];

      if(id === 'list'){
        logWithColour('List of ids:', 'white');
          
        const ids = aniflix.getRandomImageOptions();

        for(let i = 0; i < ids.length; i++){
          logWithColour("ris " + ids[i], 'white', "ris " + ids[i]);
        }

        return;
      }

      nsfwIcons(id);
      logSuccess('Changed backgrounds: ' + id);
      return;
    }

    if (cmd.startsWith('navigate')) {
      const url = cmd.split(' ')[1];
      //add the playergeneric react element into the background, then play it
      const root = document.getElementById('bg2');
    
      //get the react element as a react component
      const player = <PlayerGeneric url={url}/>;
    
      //add the react element to the background
      ReactDOM.render(player, root);
    
      return;
    }
    
    if (cmd.startsWith('bg')) {
      const darknessEffect = cmd.split(' ')[1];
      const root = document.getElementById('bg2');
    
      if (root) {
        root.style.filter = `blur(0px) brightness(${darknessEffect}%)`;
      }
    
      return;
    }

    if(cmd.startsWith('rimg')) {
      startImageChange();
      return;
    }
    
    

    if(cmd.includes('help')) {
      logWithColour('Commands:', 'white');
      logWithColour('cbg <image url> - changes the background image', 'white', 'cbg https://i.imgur.com/0Jz1M1i.jpg');
      logWithColour('clear - clears the console', 'white', 'clear');
      logWithColour('hide - hides the side menu', 'white', 'hide');


      const account = await aniflix.getCurrentProfile();
      if(!account.accountInformation.nsfw){
        return;
      } 

      logWithColour('ris {id} - appends random nsfw icons', 'orange', 'ris');      
      logWithColour('hmv <speed>- display hmv', 'orange', 'hmv');
      logWithColour('hmv list - display hmv list', 'orange', 'hmv list');
      logWithColour('navigate <url>', 'orange', 'navigate');
      logWithColour('bg <opacity>', 'orange', 'navigate');
      logWithColour('rimg', 'orange', 'rimg');
      return;
    }

    //print error message if the command is not recognized
    logError(`Command "${cmd}" not recognized`);


  }

  function logWithColour(input: string, colour: string, commandToRun?: string){
    //create a new div element and add the input to it
    const newElement = document.createElement('div');
    newElement.classList.add('console-history-text');
    newElement.classList.add('text');

    newElement.innerHTML = input;

    //append the new element to the console
    const consoleElement = document.querySelector('.console-history');
    if(consoleElement !== null) {
      //change the text colour
      newElement.style.color = colour;

      consoleElement.appendChild(newElement);
    }
    
    if(commandToRun){
      newElement.addEventListener('click', () => {
        console.log(commandToRun);
        handleCommand(commandToRun);
      });
      newElement.style.cursor = 'pointer';
    }

    //scroll to the bottom
    const consoleHistory = document.querySelector('.console-history');
    if(consoleHistory !== null) {
      consoleHistory.scrollTop = consoleHistory.scrollHeight;
    }
  }

  const handleExecuteAction = async () => {
    // Clear the console input after executing the action
    setConsoleInput('');

    if(consoleInput.trim() === '') {
      return;
    }

    logInput(consoleInput);
    handleCommand(consoleInput);
  };

  useEffect(() => {
      const consoleHistory = document.querySelector('.console-history');
      if(consoleHistory !== null) {
        consoleHistory.scrollTop = consoleHistory.scrollHeight;
      }
      
      aniflix.getCurrentProfile().then((account) => {
        if(!account.accountInformation.nsfw){
          return;
        } 
        // handleCommand('hmv list');
        handleCommand('help');
      });
  }, []);

  return (
    <>
      <div className='modmenu-root'>
        <div className='console-input-area'>
          <div className='console-history text'>
          </div>
          <textarea
            value={consoleInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className='console-input text'
          />
        </div>
      </div>
    </>
  );
}
