import '../stylings/content/empty.css';
import * as sideMenu from '../utils/SideMenu.ts';
import * as discord from '../content-source/discord-api.ts';

export default function BackgroundChanger() {  

  sideMenu.toggle(document.getElementById('sidemenu-background-change')!);
  discord.setChilling(`Background changer`);

  return (
    <>
        <h1 className='empty'>
          "PAGE"
        </h1>
    </>
  );
}
