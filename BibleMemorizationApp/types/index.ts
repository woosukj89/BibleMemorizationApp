export interface Verse {
  verse: number;
  text: string;
}

export interface BibleData {
  [book: string]: {
    [chapter: number]: Verse[];
  };
}
