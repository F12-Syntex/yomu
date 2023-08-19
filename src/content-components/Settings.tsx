import * as discord from '../content-source/discord-api.ts';
import * as State from '../core/State.ts';
import '../stylings/content/settings.css';
import * as sideMenu from '../utils/SideMenu.ts';
import UserChange from './UserChange.tsx';

function onClick(){
  const state = <UserChange/>;
  State.updateState(state);
}

export default function settings() {  
  sideMenu.toggle(document.getElementById('sidemenu-settings')!);
  discord.setChilling(`settings`);

  return (
    <div className='settings-pane'>
      {/* <h2>Settings Page</h2> */}

      {/* switch accounts */}
      <div className='settings-option'>
        <div className='settings-option-text'>
          <h3>Switch anilist accounts</h3>
        </div>
        <div className='settings-option-button'>
          <button className='settings-button' onClick={onClick}>Switch</button>
        </div>
      </div>


    </div>
  );
  
}
