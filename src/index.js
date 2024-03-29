import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import Chat from './pages/Chat';
import User from './pages/User';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import socket from './socket';
import Home, { action as loginAction, loader as homeLoader } from './pages/Home';
import Register from './pages/Home/Register';
import FriendSuggest from './pages/User/FriendSuggest';
import Pending from './pages/User/Pending';
import Friend, { loader as contactLoader } from './pages/Friends/Friend';
import FriendList from './pages/Friends/FriendList';
import Friends from './pages/Friends';
import Followers from './pages/Followers';
import FollowerList from './pages/Followers/FollowerList';
import Follower from './pages/Followers/Follower';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App socket={socket} />,
    children: [
      { index: true, element: <Home />, action: loginAction, loader: homeLoader },
      { path: 'register', element: <Register />, action: loginAction, loader: homeLoader },
      { path: 'chat', element: <Chat /> },
      {
        path: 'users',
        element: <User />,
        children: [
          { index: true, element: <FriendSuggest socket={socket} /> },
          { path: 'users', element: <FriendSuggest socket={socket} /> },
          { path: 'pending', element: <Pending socket={socket} /> }
        ]
      },
      {
        path: 'friends',
        element: <Friends />,
        children: [
          { index: true, element: <FriendList /> },
          { path: ':id', element: <Friend />, loader: contactLoader }
        ]
      },
      {
        path: 'followers',
        element: <Followers />,
        children: [
          { index: true, element: <FollowerList /> },
          { path: ':id', element: <Follower socket={socket} />, loader: contactLoader }
        ]
      },
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
