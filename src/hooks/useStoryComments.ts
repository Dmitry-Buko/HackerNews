import { useCallback, useMemo, useState } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchComments } from "../api/hackerNews";
import type { Comment } from "../types/hn";

export function useStoryComments(storyId: number, rootComments: Comment[]) {
  const queryClient = useQueryClient();
  const [openedIds, setOpenedIds] = useState<Set<number>>(new Set()); // id комментариев, ветки которых раскрыты
  const [isRefreshing, setIsRefreshing] = useState(false); //идёт ли сейчас полное обновление
  const [treeVersion, setTreeVersion] = useState(0); // key «передёргивания» дерева

  //список всех видимых комментариев
  const visibleComments = useMemo(() => {
    const collect = (list: Comment[]): Comment[] =>
      list.flatMap((comment) => {
        if (!openedIds.has(comment.id)) return [comment];
        const kids =
          queryClient.getQueryData<Comment[]>(["comments", comment.id]) ?? [];
        console.log("comment:", comment);

        return [comment, ...collect(kids)];
      });
    return collect(rootComments);
  }, [rootComments, openedIds, queryClient]);

  const queries = useQueries({
    queries: visibleComments.map((comment) => ({
      queryKey: ["comments", comment.id],
      queryFn: () => fetchComments(comment.kids),
      enabled: openedIds.has(comment.id), // грузим только раскрытые ветки
      staleTime: 5 * 60 * 1000,
    })),
  });

  const queriesMap = useMemo(
    () =>
      visibleComments.reduce<Record<number, (typeof queries)[number]>>(
        (acc, comment, index) => {
          acc[comment.id] = queries[index];
          return acc;
        },
        {},
      ),
    [visibleComments, queries],
  );

  const onToggleChildren = useCallback((comment: Comment) => {
    setOpenedIds((prev) => new Set(prev).add(comment.id));
  }, []);

  const getChildComments = (comment: Comment) => queriesMap[comment.id]?.data;

  const isChildCommentsLoading = (comment: Comment) =>
    openedIds.has(comment.id) && queriesMap[comment.id]?.data === undefined;

  const refreshComments = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["story", storyId] });
      queryClient.removeQueries({ queryKey: ["comments"] });
      setOpenedIds(new Set());
      setTreeVersion((v) => v + 1);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, storyId]);

  return {
    getChildComments,
    isChildCommentsLoading,
    onToggleChildren,
    refreshComments,
    isRefreshing,
    treeVersion,
  };
}
