import '../stylings/content/empty.css';
import * as sideMenu from '../components/SideMenu.tsx';

export default function empty(props: {text: string}) {  

  sideMenu.toggle(document.getElementById('sidemenu-' + props.text)!);

  return (
    <>
        <h1 className='empty'>
          {props.text.toUpperCase() + " PAGE"}
        </h1>
    </>
  );
}
