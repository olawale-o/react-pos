import React from 'react';
import { useNavigate, Form, redirect, useLoaderData, useOutletContext } from 'react-router-dom';
import { loginService } from '../../services/authService';

export async function loader() {
  return JSON.parse(localStorage.getItem('user'));
}

export async function action({ request }) {
  const formData = await request.formData();
  const formDataEntries = Object.fromEntries(formData);
  const data = await loginService({
    username: formDataEntries.username,
    password: formDataEntries.password,
  });
  localStorage.setItem('user', JSON.stringify(data));
  return redirect('/');
}

const Home = () => {
  const [socket] = useOutletContext();
  const data = useLoaderData();
  const navigate = useNavigate();
  const [formValues, setFormValues] = React.useState({
    username: '',
    password: '',
  });

  React.useEffect(() => {    
    if (data !== null) {
      const { user: { username, _id, name } } = data;
      socket.auth = { user: { username, _id, name } }
      socket.connect();
      navigate('/chat');
    }
  }, [data, navigate, socket]);

  const onFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return (
    <div className="container login_container">
      <div className="login_container-header">
        <h2 className="heading heading_2">Log in</h2>
          <span>or register</span>
        </div>
      <Form method="post" className="form login_form">
        <div className="login_form-content">
          <input
            name="username"
            className="input"
            value={formValues.username}
            onChange={onFormChange}
            placeholder="Email or username"
          />
          <input
            name="password"
            className="input"
            value={formValues.password}
            onChange={onFormChange}
            placeholder="Password"
          />
          <button type="submit" className="btn btn_login">Log in</button>
        </div>
      </Form>
    </div>
  )
}

export default Home;
