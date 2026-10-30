import { Route, Routes } from "react-router-dom";
import NewsPage from "./pages/NewsPage";
import StoryPage from "./pages/StoryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewsPage />} />
      <Route path="/news/:id" element={<StoryPage />} />
    </Routes>
  );
}

export default App;
