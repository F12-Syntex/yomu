import { AnilistMedia } from "../content-source/animeflix";
import * as aniflix from "../content-source/animeflix";

      /**
       * find the manga with the most similar name to the query
       * @param query 
       * @param mangas 
       */
      export function findMostProbableManga(query: string, mangas: aniflix.AnilistMedia[]) {
          let mostSimilarManga: AnilistMedia | null = null;
          let minDistance: number = Infinity;
      
          for (const manga of mangas) {
            const romajiDistance = getLevenshteinDistance(query, manga.title.romaji ?? "");
            const nativeDistance = getLevenshteinDistance(query, manga.title.native ?? "");
        
            const distance = Math.min(romajiDistance, nativeDistance);
        
            if (distance < minDistance) {
                minDistance = distance;
                mostSimilarManga = manga;
                console.log(JSON.stringify(mostSimilarManga.title) + " : " + distance);
            }
          }
      
          return mostSimilarManga;
      }

    export function getLevenshteinDistance(a: string, b: string): number {
      const matrix: number[][] = [];
    
      for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }
    
      for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }
    
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
    
      return matrix[b.length][a.length];
    }
