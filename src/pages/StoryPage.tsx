import { Spin } from "antd";
import { StoryDetails } from "../components/story/StoryDetails";
import { useState } from "react";
import { useStoryComments } from "../hooks/useStoryComments";
import { useStory } from "../hooks/useStory";
import { CommentTree } from "../components/comments/CommentTree";
import { useParams } from "react-router-dom";

function StoryPage() {
  const [commentsLoading, setCommentsLoading] = useState(false);
  const { id } = useParams();
  const { story, rootComments, loading } = useStory(id);
  const comments = useStoryComments(50245524, rootComments);

  const handleRefreshComments = () => {
    setCommentsLoading(true);
    setTimeout(() => setCommentsLoading(false), 800);
  };

  if (loading || !story) {
    return (
      <Spin size="large" style={{ display: "block", margin: "80px auto" }} />
    );
  }

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

export default StoryPage;
