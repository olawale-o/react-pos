import React from 'react';
import { useNavigate, Form, redirect, useLoaderData } from 'react-router-dom';

export async function loader() {
  return localStorage.getItem('userName');
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  localStorage.setItem('userName', data.username);
  return redirect('/');
}

const Home = ({ socket }) => {
  const data = useLoaderData()
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('');

  
  React.useEffect(() => {      
    if (data !== null) {
      socket.emit('online', { userName: data, socketID: socket.id });
      navigate('/chat')
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
