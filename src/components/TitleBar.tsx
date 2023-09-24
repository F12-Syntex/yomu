import '../stylings/titlebar.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import * as actions from '../core/Actions.ts';
import * as State from '../core/State.ts';

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

export function handleChange(){

}

function TitleBar() {  
  return (
    <>
      <div id="titlebar">
        <div id="title"></div>
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
              <Button id="change" variant="secondary" onClick={handleChange}></Button>
            </ButtonGroup>
          </div>
      </div>
    </>
  );
}

export default TitleBar;
