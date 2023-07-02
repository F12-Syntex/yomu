export function toggle(button: HTMLElement): void {
    const buttons = document.querySelectorAll('.sidemenu-button');
  
    console.log(button);
    
    for (let i = 0; i < buttons.length; i++) {
      const currentButton = buttons[i];
      if (currentButton === button) {
        continue;
      }
  
      currentButton.classList.remove('active-button');
      currentButton.classList.add('inactive-button');
  
      const selector = currentButton.querySelector('#' + currentButton.id + '-selector');
      selector?.classList.remove('sidemenu-button-selector-active');
      selector?.classList.add('sidemenu-button-selector-inactive');
  
      const img = currentButton.querySelector('#' + currentButton.id + '-img');
      img?.classList.remove(img?.id + '-active');
      img?.classList.add(img?.id +  '-inactive');
    }
  
    if (!button.classList.contains('active-button')) {
  
        button.classList.remove('inactive-button');
        button.classList.add('active-button');
  
        const selector = button.querySelector('#' + button.id + '-selector');
        selector?.classList.remove('sidemenu-button-selector-inactive');
        selector?.classList.add('sidemenu-button-selector-active');
  
        const img = button.querySelector('#' + button.id + '-img');
        img?.classList.remove(img?.id + '-inactive');
        img?.classList.add(img?.id +  '-active');
  
    } 
    /*else { 
  
        button.classList.remove('active-button');
        button.classList.add('inactive-button');
  
        const selector = button.querySelector('#' + button.id + '-selector');
        selector?.classList.remove('sidemenu-button-selector-active');
        selector?.classList.add('sidemenu-button-selector-inactive');
  
        const img = button.querySelector('#' + button.id + '-img');
        img?.classList.remove(img?.id + '-active');
        img?.classList.add(img?.id +  '-inactive');
    }*/
  
  }