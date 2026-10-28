import { useNavigate } from "react-router-dom";
import { NewsListView } from "../components/news/NewsListView";
import { useNewsList } from "../hooks/useNewsList";

function NewsPage() {
  const { stories, loading, refetch, lastUpdatedAt, error } = useNewsList();
  const navigate = useNavigate();

  return (
    <NewsListView
      stories={stories}
      loading={loading}
      error={error}
      lastUpdatedAt={lastUpdatedAt}
      onRefresh={refetch}
      onOpenStory={(id) => navigate(`/news/${id}`)}
    />
  );
}

export default NewsPage;
