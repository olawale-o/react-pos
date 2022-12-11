import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Chat from './pages/Chat';
import User from './pages/User';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import io from 'socket.io-client';
import Home, { action as loginAction, loader as homeLoader } from './pages/Home';
import FriendSuggest from './pages/User/FriendSuggest';
import Pending from './pages/User/Pending';

const socket = io('http://localhost:4000');

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home socket={socket} />, action: loginAction, loader: homeLoader },
      { path: 'chat', element: <Chat socket={socket} /> },
      {
        path: 'users',
        element: <User />,
        children: [
          { index: true, element: <FriendSuggest /> },
          { path: 'friends', element: <FriendSuggest /> },
          { path: 'pending', element: <Pending /> }
        ]
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
