export class Section {
    private savedString: string;
    private id: string;
    private url: string;
    private type: string;
  
    public constructor(savedString: string, id: string, url: string, type: string) {
      this.id = id;
      this.savedString = savedString;
      this.url = url;
      this.type = type;
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
    public getType(): string {
        return this.type;
    }
  }