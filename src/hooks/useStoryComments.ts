import { useCallback, useMemo, useState } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchComments } from "../api/hackerNews";
import type { Comment } from "../types/hn";

/**
 * Ленивые ветки комментариев — контракт CommentTree:
 * getChildComments / isChildCommentsLoading / onToggleChildren.
 * Раскрытость — в openedIds (колбэк контракта зовётся только при раскрытии),
 * данные веток — в кэше запросов под ['comments', id] через useQueries.
 */
export function useStoryComments(storyId: number, rootComments: Comment[]) {
  const queryClient = useQueryClient();
  const [openedIds, setOpenedIds] = useState<Set<number>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [treeVersion, setTreeVersion] = useState(0); // key «передёргивания» дерева

  // Смонтированные узлы: нераскрытый — сам; раскрытый — плюс его детей из кэша.
  // Нужно, чтобы в момент раскрытия узла его запрос уже был в списке useQueries.
  const visibleComments = useMemo(() => {
    const collect = (list: Comment[]): Comment[] =>
      list.flatMap((comment) => {
        if (!openedIds.has(comment.id)) return [comment];
        const kids =
          queryClient.getQueryData<Comment[]>(["comments", comment.id]) ?? [];
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

  // id - результат запроса (useQueries сохраняет порядок переданного массива)
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

  // колбек контракта зовётся только при раскрытии — поэтому add, не toggle
  const onToggleChildren = useCallback((comment: Comment) => {
    setOpenedIds((prev) => new Set(prev).add(comment.id));
  }, []);

  const getChildComments = (comment: Comment) => queriesMap[comment.id]?.data;

  // «раскрыто, а данных ещё нет» = грузится; не мигает «No replies found»
  const isChildCommentsLoading = (comment: Comment) =>
    openedIds.has(comment.id) && queriesMap[comment.id]?.data === undefined;

  const refreshComments = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 1) Новость + корневые комментарии: перечитать. useQuery новости живёт
      //    в хуке-паре на странице — инвалидируем по ключу, активный запрос
      //    перезагрузится сам, await дождётся конца
      await queryClient.invalidateQueries({ queryKey: ["story", storyId] });
      // 2) Ветки: после сброса openedIds их запросы деактивируются,
      //    наблюдателей не останется — чистим кэш явно, чтобы повторное
      //    раскрытие снова пошло в сеть
      queryClient.removeQueries({ queryKey: ["comments"] });
      // 3) Дерево — к исходному виду: expanded сидит внутри CommentItem,
      //    сбрасываем ремоунтом через key
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
