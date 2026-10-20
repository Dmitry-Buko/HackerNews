import axios from "axios";

export const hnApi = axios.create({
  baseURL: "https://hacker-news.firebaseio.com/v0",
  timeout: 10000,
});
