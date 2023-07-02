import * as animeflix from '../content-source/animeflix.ts';

export async function loadEntries(searchGrid: Element, entries: animeflix.AnimeQuery[]) {

  for (let i = 0; i < entries.length; i++) {
    if (searchGrid !== null) {

      const mangaEntry: { 
        id: number;
        title: {
          romaji: string;
          english: string;
          native: string;
        };
        description: string;
        coverImage: {
          extraLarge: string;
          color: string;
        }
      } = entries[i];

      const img = document.createElement('div');
      img.setAttribute('class', 'grid-item'); // add the class attribute
      
      // Create a new Image object
      const actualImg = new Image();
      
      // Set the source of the actual image to the mangaEntry cover image
      actualImg.src = mangaEntry.coverImage.extraLarge;
      
      // Add an event listener to handle the load event of the actual image
      actualImg.addEventListener('load', () => {
        // When the actual image has finished loading, update the background image of the div
        img.style.backgroundImage = `url(${actualImg.src})`;
        img.style.backgroundSize = '20vw 35vh';
      });

      // create a details section for the grid item and add it to the image
      const details = document.createElement('div');
      details.setAttribute('class', 'grid-item-details');
      img.appendChild(details);

      console.log(mangaEntry.title.romaji);

      // add a title to the details section
      addMetaInfo(details, mangaEntry.title.romaji);


      img.addEventListener('click', function() {
        console.log(mangaEntry.id);
      });
      

      searchGrid.appendChild(img); // append the new element to searchGrid


    }
  }
}

function addMetaInfo(details: HTMLElement, titleText: string){
  // add a title to the details section

  const hbox = document.createElement('div');
  hbox.setAttribute('class', 'hbox1');

  const container = document.createElement('div');
  container.setAttribute('class', 'grid-item-container');

  const title = document.createElement('div');
  title.setAttribute('class', 'grid-item-title');
  title.textContent = titleText; // set text content directly
  container.appendChild(title);

  console.log(">> " + titleText);

  hbox.appendChild(container);

  details.appendChild(hbox);
}