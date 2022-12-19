import React from 'react';
import { useNavigate, Form, redirect, useLoaderData } from 'react-router-dom';
import { loginService } from '../../services/authService';

export async function loader() {
  return JSON.parse(localStorage.getItem('user'));
}

export async function action({ request }) {
  const formData = await request.formData();
  const formDataEntries = Object.fromEntries(formData);
  const data = await loginService({ username: formDataEntries.username });
  localStorage.setItem('user', JSON.stringify(data));
  return redirect('/');
}

const Home = ({ socket }) => {
  const data = useLoaderData();
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('');

  React.useEffect(() => {      
    if (data !== null) {
      socket.emit('online', { id: data.user._id, username: data.user.username, socketID: socket.id });
      navigate('/friends');
    }
  }, [data, navigate, socket, userName]);
  return (
    <div>
      <Form method="post" className="home-container">
        <h2 className="home-header">Log in</h2>
        <input
          name="username"
          className="input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button type="submit" className="home-cta">Log in</button>
      </Form>
    </div>
  )
}

export default Home;
