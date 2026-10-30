import { Alert, Button, Space, Spin } from "antd";
import { StoryDetails } from "../components/story/StoryDetails";
import { useStoryComments } from "../hooks/useStoryComments";
import { useStory } from "../hooks/useStory";
import { CommentTree } from "../components/comments/CommentTree";
import { useNavigate, useParams } from "react-router-dom";

function StoryPage() {
  const { id } = useParams();
  const STORY_ID = Number(id);
  const { story, rootComments, loading, error, refetch } = useStory(STORY_ID);
  const comments = useStoryComments(STORY_ID, rootComments);
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="hn-container">
        <Alert
          type="error"
          showIcon
          message="Failed to load story"
          description={error}
          action={
            <Space direction="vertical">
              <Button size="small" onClick={() => refetch()}>
                Retry
              </Button>
              <Button size="small" type="primary" onClick={() => navigate("/")}>
                Back to news list
              </Button>
            </Space>
          }
          style={{ marginTop: 24 }}
        />
      </div>
    );
  }

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
        onBack={() => navigate(-1)}
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
