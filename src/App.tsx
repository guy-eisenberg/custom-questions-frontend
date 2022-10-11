import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import {
  CustomizationPage,
  ExamTypePage,
  RouteErrorPage,
  RunPage,
  StartPage,
} from './pages';
import { store } from './redux';

const router = createHashRouter([
  {
    path: '/',
    index: true,
    element: <RouteErrorPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/:examId',
    element: <StartPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/:examId/select-type',
    element: <ExamTypePage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/:examId/customize',
    element: <CustomizationPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/:examId/run',
    element: <RunPage />,
    errorElement: <RouteErrorPage />,
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
