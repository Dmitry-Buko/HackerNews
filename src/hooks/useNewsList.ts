import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../api/hackerNews";

export function useNewsList() {
  const { data, isFetching, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });
  return {
    stories: data || [],
    loading: isFetching,
    error: error?.message ?? null,
    refetch,
    lastUpdatedAt: data ? Math.floor(dataUpdatedAt / 1000) : null,
  };
}
