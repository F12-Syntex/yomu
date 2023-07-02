import AniList from '../content-components/AniList.tsx';
import Empty from '../content-components/Empty.tsx';
import Hot from '../content-components/Hot.tsx';
import Search from '../content-components/Search.tsx';
import * as State from '../core/State.ts';

import React, { useState } from 'react';

// import icons
import { BsFillHouseFill } from 'react-icons/bs';
import { BsSearch } from 'react-icons/bs';
import { BsFire } from 'react-icons/bs';
import { BsGearFill } from 'react-icons/bs';

import '../stylings/content/sidemenu.css';

function SideMenu() {
  // page renderer functions
  function search(button: HTMLElement): void {
    if (button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Search />);
  }

  function anilist(button: HTMLElement): void {
    if (button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<AniList />);
  }

  function settings(button: HTMLElement): void {
    if (button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Empty text="settings" />);
  }

  function hot(button: HTMLElement): void {
    if (button.classList.contains('active-button')) return;

    console.log(button);
    State.updateState(<Hot />);
  }

  // handle button clicks
  const handleButtonClick = (buttonID: string) => {
    // get the button by ID
    const button = document.getElementById(buttonID) as HTMLInputElement;

    // Call the appropriate function
    switch (buttonID) {
      case 'anilist':
        anilist(button);
        break;
      case 'search':
        search(button);
        break;
      case 'hot':
        hot(button);
        break;
      case 'settings':
        settings(button);
        break;
      default:
        break;
    }

    // Remove the active class from all buttons
    const buttons = document.querySelectorAll('.button-container');
    buttons.forEach((button) => {
      button.classList.remove('active-button');
    });

    // Add the active class to the clicked button
    button.classList.add('active-button');
  };

  return (
    <>
      <div className="sidemenu-container">
        <div
          className="button-container"
          id="anilist"
          onClick={() => handleButtonClick('anilist')}
        >
          <div className="vanity-rectangle-of-deviously-obtuse-proportions"></div>
          <BsFillHouseFill className="icon"></BsFillHouseFill>
        </div>
        <div
          className="button-container"
          id="search"
          onClick={() => handleButtonClick('search')}
        >
          <div className="vanity-rectangle-of-deviously-obtuse-proportions"></div>
          <BsSearch className="icon"></BsSearch>
        </div>
        <div
          className="button-container"
          id="hot"
          onClick={() => handleButtonClick('hot')}
        >
          <div className="vanity-rectangle-of-deviously-obtuse-proportions"></div>
          <BsFire className="icon"></BsFire>
        </div>
        <div
          className="button-container"
          id="settings"
          onClick={() => handleButtonClick('settings')}
        >
          <div className="vanity-rectangle-of-deviously-obtuse-proportions"></div>
          <BsGearFill className="icon"></BsGearFill>
        </div>
      </div>
    </>
  );
}

export default SideMenu;
