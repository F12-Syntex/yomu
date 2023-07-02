class DynamicArray {
  array: any[];
  maxSize: number;
  currentIndex: number;

  constructor() {
    this.array = [];
    this.maxSize = 50;
    this.currentIndex = -1;
  }

  add(value: any) {
    if (this.array.length >= this.maxSize) {
      this.array.shift();
    }

    this.currentIndex++;

    this.array.splice(this.currentIndex);
    this.array.splice(this.currentIndex, 0, value);
  }
  

  get() {
    console.log(this.array[this.currentIndex]);
    return this.array[this.currentIndex];
  }

  updateCurrentValue(newElement: { type: any; props: any; } | null) {
    this.array[this.currentIndex] = newElement;
  }

  public goBack() {
    console.log(this.currentIndex);
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
    console.log(this.currentIndex);
  }

  public goForward() {
    console.log(this.currentIndex);
    if (this.currentIndex < this.array.length - 1) {
      this.currentIndex += 1;
    }
    console.log(this.currentIndex);
  }

  setIndex(index: number) {
    if (index < 0 || index >= this.array.length) {
      throw new Error("Invalid index");
    }
    this.currentIndex = index;
  }
}

export const list = new DynamicArray();