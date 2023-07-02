import React from 'react'
import { createRoot } from 'react-dom/client'
import * as actions from '../core/Actions.ts'

let root: any = undefined

export function updateState(
  newElement: { type: any; props: any } | null,
  addElement = true,
  errorMessage = ''
) {
  if (addElement) {
    actions.list.add(newElement)
  }

  // Get the content element by its class name
  const contentElement = document.querySelector('.content')

  if (contentElement === null) {
    return
  }

  if (newElement === null) {
    // Remove all children of the content element
    while (contentElement.firstChild) {
      contentElement.removeChild(contentElement.firstChild)
    }
    return
  }

  // Create a new HTML element from the passed-in parameter
  const element = React.createElement(newElement.type, newElement.props)

  const rootElement = document.getElementById('content-source')!

  if (root === undefined) {
    root = createRoot(rootElement)
  }

  root.render(element)

  if (errorMessage !== '') {
    alert(errorMessage)
  }
}
