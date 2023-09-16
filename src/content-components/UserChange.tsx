import { shell } from 'electron';
import { useEffect } from 'react';
import * as animeflix from '../content-source/animeflix.ts';
import '../stylings/content/user_change.css';
import AniList from './AniList.tsx';
import * as State from '../core/State.ts';


 async function changeUser() {

  const user = await animeflix.getProfiles();
  const active_profile = user.userprofiles.active_profile;
  const profiles = user.userprofiles.profiles;
  const keys = Object.keys(profiles);

  //add to parent element with class userchange-content-change
  const parentElement = document.querySelector('.userchange-content-change');
  if(!parentElement){
    return;
  }

  parentElement.innerHTML = '';

  let users = new Set();

  for(let i = 0; i < keys.length; i++){
    const key = keys[i];
    const profile = profiles[key];

    console.log(profile.userInformation.id, users);

    if(users.has(profile.userInformation.id)){
      //delete the profile
      const url = 'http://localhost:3023/removeProfile?profile=' + keys[i];

      await fetch(url)
      .then(response => {
        if (response.ok) {
          console.log('API call success');
        } else {
          console.error('API call failed');
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });
      continue;
    }

    if(profile.display === "false"){
      continue;
    }

    users.add(profile.userInformation.id);

    const profileElement = document.createElement('div');
    profileElement.classList.add('userchange-profile');

    //left side of the div
    const button = document.createElement('div');
    button.classList.add('userchange-profile-button');
    profileElement.appendChild(button);

    //add image in a new div
    const profileImage = document.createElement('div');
    profileImage.style.backgroundImage = 'url(' + profile.userInformation.avatar.large + ')';
    button.appendChild(profileImage);


    //add text
    const profileText = document.createElement('h3');
    profileText.classList.add('userchange-profile-text');
    profileText.innerText = profile.userInformation.name;
    button.appendChild(profileText);

    //parent div for all the buttons, it will be to the right of the text
    const buttonParent = document.createElement('div');
    buttonParent.classList.add('userchange-profile-buttons');
  
    profileElement.appendChild(buttonParent);

    //add remove button to the right of the div
    const removeButton = document.createElement('div');
    removeButton.classList.add('userchange-profile-remove');
    removeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" fill="white" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';
  
    buttonParent.appendChild(removeButton);


    if(key === active_profile){
      button.classList.add('userchange-profile-selected');
    }

    if(profile.accountInformation.nsfw === true){
      profileElement.classList.add('userchange-profile-syntexdev3');
      profileImage.classList.add('userchange-profile-image-nsfw');
      //https://thehentaigif.com/wp-content/uploads/2020/10/21483104-36.gif
      //"https://thehentaigif.com/wp-content/uploads/2020/10/23435761-73.gif"
      // profileImage.style.backgroundImage = 'url(' + "https://m1.hentaiera.com/005/4wc2vzxntp/4.gif" + ')';
      profileImage.style.backgroundImage = 'url(' + profile.userInformation.avatar.large + ')';
    }else{
      profileImage.classList.add('userchange-profile-image');
    }

    //add click event
    button.addEventListener('mousedown', () => {
      const url = 'http://localhost:3023/updatePrimaryProfile?profile=' + keys[i];

      console.log(url);

      fetch(url)
        .then(response => {
          // Handle the response
          if (response.ok) {
            console.log('API call success');
          } else {
            console.error('API call failed');
          }
          
          State.updateState(<AniList/>);

        })
        .catch(error => {
          console.error('An error occurred:', error);
        });
      
    });

    buttonParent.addEventListener('mousedown', () => {
      const url = 'http://localhost:3023/removeProfile?profile=' + keys[i];

      console.log(url);

      fetch(url)
        .then(response => {
          // Handle the response
          if (response.ok) {
            console.log('API call success');
          } else {
            console.error('API call failed');
          }
          
          changeUser();

        })
        .catch(error => {
          console.error('An error occurred:', error);
        });
      
    });

    parentElement.appendChild(profileElement);

  }

  console.log(user);
}

function addEventListeners(){
  const changeAccountButton = document.querySelector('.userchange-content-change-add-account-content');
  const refreshButton = document.querySelector('.userchange-content-change-add-account-refresh');

  if(!changeAccountButton || !refreshButton){
    return;
  }

changeAccountButton.addEventListener('mousedown', () => {
    const endpoint = 'callback';
    const port = `3023`;
    const redirectUri = "http://localhost:" + port + "/" + endpoint;
    const clientId = '13194';
    const authoriseUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    shell.openExternal(authoriseUrl);    
});

refreshButton.addEventListener('mousedown', () => {
    changeUser();
});
}

export default function userChange() {  

  useEffect(() => {
    
    changeUser();
    addEventListeners();

  }, []);

  return (
    <div className='userchange-pane'>
      <div className='userchange-content-change'>

      </div>
      <div className='userchange-content-change-add-account'>
        <div className='userchange-content-change-add-account-content'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20%" height="60%" fill="white" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          <h3 id='userchange-content-change-add-account-text'>Add account</h3>
        </div>
        <div className='userchange-content-change-add-account-refresh'>
        <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="40%" fill="white" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
        </svg>
        </div>
      </div>
    </div>
  );
}
