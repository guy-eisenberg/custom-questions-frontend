import { createHashRouter, RouterProvider } from 'react-router-dom';
import { ExamTypePage, RouteErrorPage, RunPage, StartPage } from './pages';

const router = createHashRouter([
  {
    path: '/',
    index: true,
    element: <RouteErrorPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/:activityId',
    element: <StartPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/:activityId/select-type',
    element: <ExamTypePage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/:activityId/run',
    element: <RunPage />,
    errorElement: <RouteErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
