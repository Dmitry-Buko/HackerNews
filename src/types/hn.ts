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

export interface StoryPageData {
  story: Story;
  rootComments: Comment[];
}