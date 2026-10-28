/**
 * ВРЕМЕННАЯ страница-превью визуальных компонентов на мок-данных.
 * Показывает, как выглядят NewsListView / StoryDetails / CommentTree
 * и как контейнер страницы работает с их props.
 *
 * Когда напишете свои страницы и роутер — удалите эту папку целиком
 * и верните App.tsx к роутингу.
 */
// import { useCallback, useState } from "react";
import { Spin, Tabs, message } from "antd";
import { NewsListView } from "../components/news/NewsListView";
import { StoryDetails } from "../components/story/StoryDetails";
import { CommentTree } from "../components/comments/CommentTree";
// import {
//   mockCommentsById,
//   mockRootComments,
//   mockStories,
// } from "../mocks/hnMockData";
// import type { Comment } from "../types/hn";
import { useNewsList } from "../hooks/useNewsList";
import { useStory } from "../hooks/useStory";
import { useStoryComments } from "../hooks/useStoryComments";
import { useState } from "react";

function NewsListDemo() {
  // const [loading, setLoading] = useState(false);
  // const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const { stories, loading, refetch, lastUpdatedAt, error } = useNewsList();

  // const handleRefresh = () => {
  //   setLoading(true);
  //   // имитация запроса к API
  //   setTimeout(() => {
  //     setLoading(false);
  //     setLastUpdatedAt(Math.floor(Date.now() / 1000));
  //   }, 800);
  // };

  return (
    <NewsListView
      stories={stories}
      loading={loading}
      error={error}
      lastUpdatedAt={lastUpdatedAt}
      onRefresh={refetch}
      onOpenStory={(id) => message.info(`This will open story ${id}`)}
    />
  );
}

function StoryPageDemo() {
  const { story, rootComments, loading } = useStory(50259604);
  const comments = useStoryComments(50245524, rootComments);
  // const story = mockStories[0];
  // const story = stories;
  const [commentsLoading, setCommentsLoading] = useState(false);
  // const [loadingChildrenOf, setLoadingChildrenOf] = useState<Set<number>>(
  //   new Set(),
  // );
  // const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());

  const handleRefreshComments = () => {
    setCommentsLoading(true);
    setTimeout(() => setCommentsLoading(false), 800);
  };

  if (loading || !story) {
    return (
      <Spin size="large" style={{ display: "block", margin: "80px auto" }} />
    );
  }

  // «Догрузка» детей: в моке они уже в словаре, поэтому просто пауза для наглядности
  // const handleToggleChildren = (comment: Comment) => {
  //   if (loadedIds.has(comment.id)) return;
  //   setLoadingChildrenOf((prev) => new Set(prev).add(comment.id));
  //   setTimeout(() => {
  //     setLoadingChildrenOf((prev) => {
  //       const next = new Set(prev);
  //       next.delete(comment.id);
  //       return next;
  //     });
  //     setLoadedIds((prev) => new Set(prev).add(comment.id));
  //   }, 600);
  // };

  // const getChildComments = useCallback(
  //   (comment: Comment): Comment[] | undefined => {
  //     if (!loadedIds.has(comment.id)) return undefined;
  //     return comment.kids.map((id) => mockCommentsById[id]).filter(Boolean);
  //   },
  //   [loadedIds],
  // );

  // const isChildCommentsLoading = useCallback(
  //   (comment: Comment) => loadingChildrenOf.has(comment.id),
  //   [loadingChildrenOf],
  // );

  return (
    <>
      <StoryDetails
        story={story}
        commentsLoading={comments.isRefreshing}
        onRefreshComments={comments.refreshComments}
        onBack={() => message.info("This will go back to the news list")}
      />
      <CommentTree
        key={comments.treeVersion}
        rootComments={rootComments}
        getChildComments={comments.getChildComments}
        isChildCommentsLoading={comments.isChildCommentsLoading}
        onToggleChildren={comments.onToggleChildren}
      />
    </>
  );
}

export function VisualDemo() {
  return (
    <Tabs
      centered
      defaultActiveKey="list"
      items={[
        { key: "list", label: "News List", children: <NewsListDemo /> },
        { key: "story", label: "Story Page", children: <StoryPageDemo /> },
      ]}
    />
  );
}
