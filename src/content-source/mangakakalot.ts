export interface MangaEntry {
  manga: {
    id: number;
    alt: string;
    img: string;
  };
}

export async function fetchMangaDetails(url: string) {
  console.log("fetching data from mangakakalot[\"" + url + "\"]");

  const puppeteer = require('puppeteer');

  return (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(url);
    
    const content = await page.content();

    console.log(content);

    await browser.close();

  })();

}


export async function fetchMangas(query: string) {
  console.log("fetching data from mangakakalot[\"" + query + "\"]");

  const url = "https://mangakakalot.com/search/story/" + query.replace(" ", "_") + "";

  const puppeteer = require('puppeteer');

  const mangaEntries: { url: string; alt: string; img: string }[] = [];

  return (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(url);
    
    const content = await page.content();

    const splitArray = content.split('<div class="story_item">');

    splitArray.shift();

    for(let i = 0; i < splitArray.length; i++) {

      const meta = [
        splitArray[i].split('a rel="nofollow" href="')[1].split('"')[0],
        splitArray[i].split('img src="')[1].split('"')[0],
        splitArray[i].split('alt="')[1].split('"')[0],
      ]
      
      const mangaEntry = {
        url: meta[0],
        alt: meta[2],
        img: meta[1]
      };

      mangaEntries.push(mangaEntry);

    }

    await browser.close();
      
    return mangaEntries;  

  })();

}


export async function fetchRecent() {

  let url = "https://mangakakalot.com/manga_list?type=topview&category=all&state=all&page=1";

  console.log("fetching data from mangakakalot[\"" + url + "\"]");

  const puppeteer = require('puppeteer');

  const mangaEntries: { url: string; alt: string; img: string }[] = [];

  return (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(url);
    
    let content = await page.content();

    let splitArray = content.split('<div class="list-truyen-item-wrap">');

    splitArray.shift();

    for(let i = 0; i < splitArray.length; i++) {

      const meta = [
        splitArray[i].split('href="')[1].split('"')[0],
        splitArray[i].split('img src="')[1].split('"')[0],
        splitArray[i].split('title="')[1].split('"')[0],
      ]

      
      const mangaEntry = {
        url: meta[0],
        alt: meta[2],
        img: meta[1]
      };

      mangaEntries.push(mangaEntry);

    }

    await browser.close();
      
    return mangaEntries;  

  })();
  

}

