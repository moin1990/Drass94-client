import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Ideas from './pages/Ideas';
import IdeaDetails from './pages/IdeaDetails';
import AddIdea from './pages/AddIdea';
import MyIdeas from './pages/MyIdeas';
import MyInteractions from './pages/MyInteractions';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'ideas', element: <Ideas /> },
      {
        path: 'ideas/:id',
        element: (
          <PrivateRoute>
            <IdeaDetails />
          </PrivateRoute>
        ),
      },
      {
        path: 'add-idea',
        element: (
          <PrivateRoute>
            <AddIdea />
          </PrivateRoute>
        ),
      },
      {
        path: 'my-ideas',
        element: (
          <PrivateRoute>
            <MyIdeas />
          </PrivateRoute>
        ),
      },
      {
        path: 'my-interactions',
        element: (
          <PrivateRoute>
            <MyInteractions />
          </PrivateRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
