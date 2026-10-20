import { VisualDemo } from './demo/VisualDemo';

/**
 * ВРЕМЕННО: показываем демо визуальных компонентов.
 * Замените на роутер и страницы-контейнеры:
 * BrowserRouter → Routes → '/' (список) и '/news/:id' (новость).
 */
function App() {
  return <VisualDemo />;
}

export default App;
