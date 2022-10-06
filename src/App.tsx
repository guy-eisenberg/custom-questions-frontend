import { createHashRouter, RouterProvider } from 'react-router-dom';
import { RouteErrorPage, StartPage } from './pages';

const router = createHashRouter([
  {
    path: '/',
    element: <StartPage />,
    errorElement: <RouteErrorPage />,
  },
]);

function App() {
  return (
    <div className="h-full bg-[#f3f3f3]">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
