import { shell } from 'electron';
import { useEffect } from 'react';
import * as animeflix from '../content-source/animeflix.ts';
import '../stylings/content/user_change.css';

 async function changeUser() {

  const user = await animeflix.getProfiles();
  const profiles = user.userprofiles.profiles;
  const keys = Object.keys(profiles);

  for(let i = 0; i < keys.length; i++){
    const key = keys[i];
    //const profile = profiles[key];


    const profileElement = document.createElement('div');
    profileElement.classList.add('userchange-profile');
    
    //add text
    const profileText = document.createElement('h3');
    profileText.classList.add('userchange-profile-text');
    profileText.innerText = key;
    profileElement.appendChild(profileText);

    //add to parent element with class userchange-content-change
    const parentElement = document.querySelector('.userchange-content-change');
    if(!parentElement){
      return;
    }
    parentElement.appendChild(profileElement);

  }

  console.log(user);

  // user.userprofiles.forEach((profile: any) => {
  //   console.log(profile);
  // });

  

  const changeAccountButton = document.querySelector('.userchange-content-change-add-account');
  if(!changeAccountButton){
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
}

export default function userChange() {  

  useEffect(() => {
    
    changeUser();


  }, []);

  return (
    <div className='userchange-pane'>
      <div className='userchange-content-change'>

      </div>
      <div className='userchange-content-change-add-account'>
        <svg xmlns="http://www.w3.org/2000/svg" width="20%" height="60%" fill="white" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        <h3 id='userchange-content-change-add-account-text'>Add account</h3>
      </div>
    </div>
  );
}
