import { useQuery } from "@tanstack/react-query";
import { fetchStoryWithRootComments } from "../api/hackerNews";

/** загрузка новости с комментариями  */
export function useStory(id: number) {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["story", id],
    queryFn: () => fetchStoryWithRootComments(id),
  });

  return {
    story: data?.story,
    rootComments: data?.rootComments ?? [],
    loading: isPending,
    error: error ? error.message : null,
    refetch,
  };
}
