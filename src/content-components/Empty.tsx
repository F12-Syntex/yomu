import '../stylings/content/empty.css';
import * as sideMenu from '../utils/SideMenu.ts';
import * as discord from '../content-source/discord-api.ts';

export default function empty(props: {text: string}) {  
  sideMenu.toggle(document.getElementById('sidemenu-' + props.text)!);
  discord.setChilling(`${props.text}`);

  return (
    <>
        <h1 className='empty'>
          {props.text.toUpperCase() + " PAGE"}
        </h1>
    </>
  );
}
