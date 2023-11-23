import React from "react";
import { createRoot } from "react-dom/client";
import * as actions from '../core/Actions.ts';
import * as animeflix from '../content-source/animeflix.ts';

let root: any = undefined;

export function updateState(newElement: { type: any; props: any; } | null, addElement: boolean = true, errorMessage: string = '') {

  if(addElement){
    actions.list.add(newElement);
  }

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

  if (root && root.unmount && typeof root.unmount === 'function') {
    // Check if root is mounted and has an unmount function
    root.unmount();
  }
  
  root = createRoot(rootElement);
  root.render(element);
  
  // animeflix.getCurrentProfile().then(async (profile) => {
  //   if(!profile.accountInformation.nsfw){
  //     const mediaButton = document.getElementById('sidemenu-media') as HTMLInputElement;
  //     mediaButton.remove(); 
  //   }
  // });
  

  if(errorMessage !== '') {
    alert(errorMessage);
  }
}
