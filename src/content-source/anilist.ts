export async function search(query: string){
    console.log("fetching data from animeflix[\"" + query + "\"]");
    
    const url = "https://animeflix.live/search/" + query.replace(" ", "%20") + "";
    
    const puppeteer = require('puppeteer');
    
    const mangaEntries: { url: string; alt: string; img: string }[] = [];
    
    return (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.goto(url);
        
        const content = await page.content();

        console.log(content);
    
        await browser.close();
    
    })();
}