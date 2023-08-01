export class Section {
    private savedString: string;
    private id: string;
    private url: string;
  
    public constructor(savedString: string, id: string, url: string) {
      this.id = id;
      this.savedString = savedString;
      this.url = url;
    }

    public getSavedString(): string {
        return this.savedString;
    }

    public getId(): string {
        return this.id;
    }

    public getUrl(): string {
        return this.url;
    }
  }