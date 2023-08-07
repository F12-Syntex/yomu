import { text } from "express";
import * as aniflix from "../content-source/animeflix";

const chillingImg = "https://avatarfiles.alphacoders.com/896/thumb-89615.png";
const searchingImg = "https://avatarfiles.alphacoders.com/896/thumb-89615.png";
const hotAnime = "https://avatarfiles.alphacoders.com/896/thumb-89615.png";


export interface DiscordActivity {
    details?: string;
    state?: string;
    startTimestamp?: number;
    endTimestamp?: number;
    largeImageKey?: string;
    largeImageText?: string;
    smallImageKey?: string;
    smallImageText?: string;
    instance?: boolean;
}


/**
 * Sets the users status to the given activity
 */
export function setDiscordActivity(activity: DiscordActivity) : void {
    sendRequest(activity);
}

/**
 * Sets the user's status to "Chilling" to the current state the application is in, for example,
 * if the user is in the settings page, the status will be set to "Chilling in Settings"
 */
export function setChilling(state: string, img?: string) : void {

    let activity: DiscordActivity = {
        details: `Chilling in ${state}`,
        startTimestamp: Date.now(),
        largeImageKey: img || chillingImg,
        largeImageText: "Chilling",
    }

    sendRequest(activity);
}

/**
 * Sets the user's status to "Chilling" to the current state the application is in, for example,
 * if the user is in the settings page, the status will be set to "Chilling in Settings"
 */
export function BrowsingAnime(anime: aniflix.Anime) : void {

    let activity: DiscordActivity = {
        details: `looking at ${anime.title.romaji} anime`,
        startTimestamp: Date.now(),
        largeImageKey: anime.coverImage.extraLarge,
        largeImageText: "cover-image",
    }

    sendRequest(activity);
}

export function BrowsingManga(manga: aniflix.AnilistMedia) : void {

    let activity: DiscordActivity = {
        details: `looking at ${manga.title.romaji} manga`,
        startTimestamp: Date.now(),
        largeImageKey: manga.coverImage?.extraLarge,
        largeImageText: "cover-image",
    }

    sendRequest(activity);
}

/**
 * Hot status
 */
export function hotMenu() : void {

    let activity: DiscordActivity = {
        details: `Browsing hot anime.`,
        startTimestamp: Date.now(),
        largeImageKey: hotAnime,
        largeImageText: "Chilling",
    }

    sendRequest(activity);
}

/**
 * Sets the user's status to "Chilling" to the current state the application is in, for example,
 * if the user is in the settings page, the status will be set to "Chilling in Settings"
 */
export function setSearching() : void {

    let activity: DiscordActivity = {
        details: `Searching for anime`,
        startTimestamp: Date.now(),
        largeImageKey: searchingImg,
        largeImageText: "Searching",
    }

    sendRequest(activity);
}

/**
 * Sets the users status to watching an anime with the duration provided
 * @param anime, the anime the user is watching
 * @param episode, the episode the user is watching
 * @param duration, the duration of the episode the user is watching 
 */
export function setWatchingAnime(animeTitle: string, episode: number, episodes: number, coverImage: string) : void {

    if(episodes === null || episodes === undefined) {
        let activity: DiscordActivity = {
            details: `Watching ${animeTitle}`,
            state: `Episode ${episode}`,
            startTimestamp: Date.now(),
            largeImageKey: coverImage,
            largeImageText: animeTitle,
        }
    
        sendRequest(activity);
        return;
    }

    let activity: DiscordActivity = {
        details: `Watching ${animeTitle}`,
        state: `Episode ${episode}/${episodes}`,
        startTimestamp: Date.now(),
        largeImageKey: coverImage,
        largeImageText: animeTitle,
    }

    sendRequest(activity);

}

let readingTime: number | null; // Global variable declaration

export function setReadingTime(time: number) : void {
    readingTime = time;
}

export function setWatchingManga(mangaTitle: string, chapter: number, chapters: number, coverImage: string) : void {
    let actual_chapters = 'On going';

    if(chapters !== null && chapters !== undefined) {
        actual_chapters = chapters.toString();
    }

    let timestamp: number = Date.now();

    if(!(readingTime === null || readingTime === undefined)) {
        timestamp = readingTime;
    }

    let activity: DiscordActivity = {
        details: `Reading ${mangaTitle}`,
        state: `chapter ${chapter}/${actual_chapters}`,
        startTimestamp: timestamp,
        largeImageKey: coverImage,
        largeImageText: mangaTitle,
    }

    sendRequest(activity);
}

export function setWatchingMangaCached(mangaTitle: string, chapter: number, chapters: number, coverImage: string) : void {
    let actual_chapters = 'On going';

    if(chapters !== null && chapters !== undefined) {
        actual_chapters = chapters.toString();
    }

    let timestamp: number = Date.now();

    if(!(readingTime === null || readingTime === undefined)) {
        timestamp = readingTime;
    }

    let activity: DiscordActivity = {
        details: `Reading ${mangaTitle}`,
        state: `chapter ${chapter}/${actual_chapters}`,
        startTimestamp: timestamp,
        largeImageKey: coverImage,
        largeImageText: mangaTitle,
    }

    sendRequest(activity);
}


function sendRequest(activity: DiscordActivity) {

    console.log("recived request of: " + activity.details);

    let port = '3024';
    let hostname = 'localhost';

    let url = `http://${hostname}:${port}/discord`;

    const queryParams = [];

    if (activity?.details !== null && activity?.details !== undefined) {
        queryParams.push(`details=${encodeURIComponent(activity.details)}`);
    }

    if (activity?.state !== null && activity?.state !== undefined) {
        queryParams.push(`state=${encodeURIComponent(activity.state)}`);
    }

    if (activity?.startTimestamp !== null && activity?.startTimestamp !== undefined) {
        queryParams.push(`startTimestamp=${encodeURIComponent(activity.startTimestamp)}`);
    }

    if (activity?.endTimestamp !== null && activity?.endTimestamp !== undefined) {
        queryParams.push(`endTimestamp=${encodeURIComponent(activity.endTimestamp)}`);
    }

    if (activity?.largeImageKey !== null && activity?.largeImageKey !== undefined) {
        queryParams.push(`largeImageKey=${encodeURIComponent(activity.largeImageKey)}`);
    }

    if (activity?.largeImageText !== null && activity?.largeImageText !== undefined) {
        queryParams.push(`largeImageText=${encodeURIComponent(activity.largeImageText)}`);
    }

    if (activity?.smallImageKey !== null && activity?.smallImageKey !== undefined) {
        queryParams.push(`smallImageKey=${encodeURIComponent(activity.smallImageKey)}`);
    }

    if (activity?.smallImageText !== null && activity?.smallImageText !== undefined) {
        queryParams.push(`smallImageText=${encodeURIComponent(activity.smallImageText)}`);
    }

    if (activity?.instance !== null && activity?.instance !== undefined) {
        queryParams.push(`instance=${encodeURIComponent(activity.instance)}`);
    }

    if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
    }

    console.log("Sending request to: " + url);
    
    fetch(url).then(() => {
        console.log("sent request to discord api");
    })
    .catch((error) => {
        console.log(error);
    });

}

