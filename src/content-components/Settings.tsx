import * as discord from '../content-source/discord-api.ts';
import * as State from '../core/State.ts';
import '../stylings/content/settings.css';
import * as sideMenu from '../utils/SideMenu.ts';
import UserChange from './UserChange.tsx';

function onClick(){
  const state = <UserChange/>;
  State.updateState(state);
}

function Reconnect(){
  alert('Not implemented yet');
}

/**
 * Disconnects the user from discord
 */
function Disconnect(){
  alert('Not implemented yet');
}

export default function settings() {  
  sideMenu.toggle(document.getElementById('sidemenu-settings')!);
  discord.setChilling(`settings`);



  return (
    <div className='settings-pane'>
      {/* <h2>Settings Page</h2> */}

      {/* switch accounts */}

      {/* <div className='settings-option'>
        <div className='settings-option-text'>
          <h3>Switch anilist accounts</h3>
          <h3>Discord prescence</h3>
        </div>
        <div className='settings-option-button'>
          <button className='settings-button' onClick={onClick}>Switch</button>
          <div className='discord-prescence-button'>
            <button className='settings-button' onClick={Reconnect}>Reconnect</button>
            <button className='settings-button' onClick={Disconnect}>Disconnect</button>
          </div>
        </div>
      </div> */}
    </div>
  );
  
}
