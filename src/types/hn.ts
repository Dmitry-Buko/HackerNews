export interface Story {
  id: number;
  title: string;
  url: string | null;
  by: string;
  time: number;
  score: number;
  descendants: number;
  kids: number[];
  category?: string;
}

export interface Comment {
  id: number;
  by: string;
  time: number;
  text: string;
  kids: number[];
  deleted?: boolean;
  dead?: boolean;
}

export interface RawItem {
  id: number;
  type: "story" | "comment" | "job" | "poll" | "pollopt";
  title?: string;
  url?: string;
  by?: string;
  time?: number;
  score?: number;
  descendants?: number;
  kids?: number[];
  text?: string;
  deleted?: boolean;
  dead?: boolean;
}

export interface StoryPageData {
  story: Story;
  rootComments: Comment[];
}