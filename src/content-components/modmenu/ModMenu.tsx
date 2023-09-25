import React, { useState } from 'react';
import './menu.css';

export default function ModMenu(props: { text: string }) {
  const [consoleInput, setConsoleInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConsoleInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.key === 'Enter') {
      handleExecuteAction();
      e.preventDefault();
    }
  };

  function changeBackground(input: string) {
    const root = document.getElementById('yomu-bg');
    if(root !== null) {
      root.style.backgroundImage = `url(${input.split(' ')[1]})`;
      root.style.backgroundSize = 'cover';
      root.style.backgroundPosition = 'center';
    }
    
  }

  function logInput(input: string){
    //create a new div element and add the input to it
    const newElement = document.createElement('div');
    newElement.classList.add('console-history-text');
    newElement.classList.add('text');

    newElement.innerHTML = input;

    //append the new element to the console
    const consoleElement = document.querySelector('.console-history');
    if(consoleElement !== null) {
      consoleElement.appendChild(newElement);
    }

    //scroll to the bottom
    const consoleHistory = document.querySelector('.console-history');
    if(consoleHistory !== null) {
      consoleHistory.scrollTop = consoleHistory.scrollHeight;
    }
  }

  const handleExecuteAction = () => {
    // Clear the console input after executing the action
    setConsoleInput('');

    logInput(consoleInput);

    //print console log into the screen as the user types some kind of commands
    if(consoleInput.includes('cbg')) {
      changeBackground(consoleInput);
      return;
    }
  };

  return (
    <>
      <div className='modmenu-root'>
        <div className='console-input-area'>
          <div className='console-history text'>
          </div>
          <textarea
            value={consoleInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className='console-input text'
          />
        </div>
      </div>
    </>
  );
}
