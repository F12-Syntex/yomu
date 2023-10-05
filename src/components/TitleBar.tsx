import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import * as aniflix from '../content-source/animeflix.ts';
import * as actions from '../core/Actions.ts';
import * as State from '../core/State.ts';
import '../stylings/titlebar.css';

function handleMinimize() {
  const ipc = require('electron').ipcRenderer;
  ipc.send('handleMinimize');
  console.log(ipc);
}

function handleMaximize() {
  const ipc = require('electron').ipcRenderer;
  ipc.send('handleMaximize');
  console.log(ipc);
}

function handleClose() {
  const ipc = require('electron').ipcRenderer;
  ipc.send('handleClose');
  console.log(ipc);
}


export function handleBack() {

  const indexBefore = actions.list.currentIndex;

  actions.list.goBack();
  const state : any = actions.list.get();

  if (indexBefore === actions.list.currentIndex) {
    return;
  }

  State.updateState(state, false);

}

export function handleNext() {
  const indexBefore = actions.list.currentIndex;

  actions.list.goForward();
  const state : any = actions.list.get();

  if (indexBefore === actions.list.currentIndex) {
    return;
  }
  
  State.updateState(state, false);
}

function updateForChild(className : string, appendChildren : boolean = true, id : string = "1"){
  // Select elements with specific classes
  const elements = document.querySelectorAll(className);

  // Loop through each element
  elements.forEach((element: Element) => {
    // Get all children of the current element
    const children = element.querySelectorAll('*');

    if(appendChildren){
      // Loop through each child element and update its background image
      children.forEach((child: Element) => {
        if(child instanceof HTMLElement){
          updateCss(child);
        }
      });
    }else{
      // Update the background image of the current element
      if(element instanceof HTMLElement){
        updateCss(element);
      }
    }

  });

  async function updateCss(element: HTMLElement){
  
    const randomPfp = await aniflix.getRandomImage(id);

    if(element.classList.contains('yomu-background')){

      console.log("yomu-background");
      
      const pseudoElement = document.createElement('div');
      pseudoElement.style.content = '""';
      pseudoElement.style.position = 'absolute';
      pseudoElement.style.top = '0';
      pseudoElement.style.left = '0';
      pseudoElement.style.width = '100%';
      pseudoElement.style.height = '100%';
      pseudoElement.style.zIndex = '-1';
      pseudoElement.style.filter = 'blur(0px) brightness(5%)';
      pseudoElement.style.backgroundImage = `url("${randomPfp}")`;
      pseudoElement.style.backgroundSize = 'cover';
      pseudoElement.style.backgroundPosition = 'center';
      pseudoElement.style.backgroundRepeat = 'no-repeat';
      pseudoElement.style.imageRendering = '-webkit-optimize-contrast';
      pseudoElement.classList.add('yomu-background');

      //remove all childrem with the class yomu-background
      const children = element.querySelectorAll('.yomu-background');
      children.forEach(child => {
        element.removeChild(child);
      });

      element.appendChild(pseudoElement)

      //render a ract component to yomu-background
      // ReactDOM.render(
      //   <PlayerGeneric url={`https://spankbang.com/8sqnl/embed/`} />,
      //   element.appendChild(document.createElement('div'))
      // );


      // https://hentaiprn.xyz/videos/HMV/Netokano%20-%20HMV.mp4
      // https://hentaiprn.xyz/videos/HMV/I%20Love%20Milfs%20Remaster.m4v
      // const iframeElement = document.createElement('iframe');
      // iframeElement.setAttribute('src', 'https://hentaiprn.xyz/videos/HMV/I%20Love%20Milfs%20Remaster.m4v');
      // iframeElement.setAttribute('autoplay', ''); // Add autoplay attribute
      // iframeElement.style.position = 'absolute';
      // iframeElement.style.top = '-10px';
      // iframeElement.style.left = '-10px';
      // iframeElement.style.width = '100%';
      // iframeElement.style.height = '100%';
      // iframeElement.style.zIndex = '-1';
      // iframeElement.style.border = 'none';
      // iframeElement.style.filter = 'blur(0px) brightness(20%)';
      // iframeElement.classList.add('yomu-background');
      // element.appendChild(iframeElement);


    }else{
      element.style.backgroundImage = `url("${randomPfp}")`;
      element.style.backgroundSize = `cover`;
      element.style.backgroundRepeat = 'no-repeat';
      element.style.backgroundPosition = 'center';
    }
  }
}

export async function nsfwIcons(id : string) {

  //only allow nsfw accounts

  // const account = await aniflix.getCurrentProfile();
  // if(!account.accountInformation.nsfw){
  //   handleSFW();
  //   return;
  // } 

  updateForChild('.yomu-background', false, id);
  updateForChild('.sidemenu-button', true, id);
  updateForChild('.profile-banner', false, id);
  updateForChild('.profile-anime-entry-header', false, id);
  updateForChild('.profile-banner-img', false, id);

}

// function handleSFW() {
//     alert("Unimplemented");
// }

function TitleBar() {  
  return (
    <>
      <div id="titlebar">
        {/* <div id="title">
        </div> */}
        <div id="controls">
          <ButtonGroup id="content" className='default-buttons'>
            <Button id="minimize" variant="secondary" onClick={handleMinimize}></Button>
            <Button id="maximize" variant="secondary" onClick={handleMaximize}></Button>
            <Button id="close" variant="secondary"  onClick={handleClose}></Button>
          </ButtonGroup>
        </div>
        <div className='directional-buttons'>
          <ButtonGroup id="content-directional">
            <Button id="back" variant="secondary" onClick={handleBack}></Button>
            <Button id="front" variant="secondary" onClick={handleNext}></Button>
            <Button id="change" variant="secondary"></Button>
            {/* <div className='extra'></div> */}
          </ButtonGroup>
        </div>
      </div>
    </>
  );
}

export default TitleBar;
