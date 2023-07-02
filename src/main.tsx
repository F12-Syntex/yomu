import React, { Fragment } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// ! TODO ALL THIS ROUTING... STUFF IS BROKEN
// ! THIS MAY NEED TO BE REMOVED AND ADDED TO EACH SUBPAGE (HOME, SEARCH, HOT) RESPECTIVELY, TO CONSTRUCT THE PAGES AND ROUTE THEM FROM HERE
import SideMenu from './components/SideMenu.tsx'
import TitleBar from './components/TitleBar.tsx'

import Home from './pages/Home.tsx'
import Search from './pages/Search.tsx'
import Hot from './pages/Hot.tsx'
import AniList from './pages/AniList.tsx'
import Settings from './pages/Settings.tsx'

// * ensure to import CSS after all components to avoid rendering issues
import './stylings/global/index.css'

// make router
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Fragment>
        <SideMenu></SideMenu>
        <Home></Home>
      </Fragment>
    )
  },
  {
    path: '/anilist',
    element: (
      <Fragment>
        <SideMenu></SideMenu>
        <AniList></AniList>
      </Fragment>
    )
  },
  {
    path: '/search',
    element: (
      <Fragment>
        <SideMenu></SideMenu>
        <Search></Search>
      </Fragment>
    )
  },
  {
    path: '/hot',
    element: (
      <Fragment>
        <SideMenu></SideMenu>
        <Hot></Hot>
      </Fragment>
    )
  },
  {
    path: '/settings',
    element: (
      <Fragment>
        <SideMenu></SideMenu>
        <Settings></Settings>
      </Fragment>
    )
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="grid">
      <div className="titlebar">
        <TitleBar />
      </div>
      <div className="sidemenu">
        <SideMenu />
      </div>
      <div className="content" id="content-source"></div>
    </div>
  </React.StrictMode>
)

postMessage({ payload: 'removeLoading' }, '*')
