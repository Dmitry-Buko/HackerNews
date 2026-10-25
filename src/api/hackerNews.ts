import { hnApi } from "./hnApi";
import type { Story, Comment, StoryPageData } from "../types/hn";

interface RawItem {
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

//маппер новость
function mapStory(raw: RawItem | null): Story | null {
  if (raw === null || raw.type !== "story") return null;
  return {
    id: raw.id,
    title: raw.title ?? "",
    url: raw.url ?? null,
    by: raw.by ?? "",
    time: raw.time ?? 0,
    score: raw.score ?? 0,
    descendants: raw.descendants ?? 0,
    kids: raw.kids ?? [],
  };
}
//маппер комментарии
function mapComment(raw: RawItem | null): Comment | null {
  if (raw === null || raw.type !== "comment") return null;
  return {
    id: raw.id,
    by: raw.by ?? "",
    time: raw.time ?? 0,
    text: raw.text ?? "",
    kids: raw.kids ?? [],
    deleted: raw.deleted ?? false,
    dead: raw.dead ?? false,
  };
}

//загрузка новости по ид
async function fetchItem<T>(id: number): Promise<T | null> {
  const { data } = await hnApi.get<T | null>(`/item/${id}.json`);
  return data;
}

//ид новостей
async function fetchStoryIds(limit = 100): Promise<number[]> {
  const { data } = await hnApi.get<number[]>("/topstories.json");
  return Array.isArray(data) ? data.slice(0, limit) : [];
}

function isNotNull<T>(item: T | null): item is T {
  return item !== null;
}

async function fetchInChunks<T>(
  ids: number[],
  chunkSize: number,
  load: (id: number) => Promise<T | null>,
): Promise<T[]> {
  const result: T[] = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const chunkResult = await Promise.allSettled(chunk.map(load));
    const correctTasks = chunkResult
      .filter((item) => item.status === "fulfilled")
      .map((item) => item.value);
    chunkResult
      .filter((item) => item.status === "rejected")
      .forEach((item) => console.warn(item.reason));
    result.push(...correctTasks.filter(isNotNull));
  }
  return result;
}

async function fetchStoryById(id: number): Promise<Story | null> {
  return mapStory(await fetchItem<RawItem>(id));
}

export async function fetchNews(): Promise<Story[]> {
  const ids = await fetchStoryIds();
  const stories = await fetchInChunks(ids, 10, fetchStoryById);
  console.log(
    "stories:",
    stories.sort((a, b) => b.time - a.time),
  );
  return stories.sort((a, b) => b.time - a.time);
}

export async function fetchComments(ids: number[]): Promise<Comment[]> {
  const comments = await Promise.all(
    ids.map((id) => fetchItem<RawItem>(id).then(mapComment)),
  );
  return comments.filter((item): item is Comment => item !== null);
}

export async function fetchStoryWithRootComments(
  id: number,
): Promise<StoryPageData> {
  const story = mapStory(await fetchItem<RawItem>(id));
  if (!story) {
    throw new Error(`Story ${id} not found`);
  }
  // console.log('story:', story);

  const rootComments = await fetchComments(story.kids);
  return { story, rootComments };
}
