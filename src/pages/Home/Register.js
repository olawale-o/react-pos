import React from 'react';
import { useNavigate, Form, redirect, useLoaderData, useOutletContext } from 'react-router-dom';
import { registerService } from '../../services/authService';

export async function loader() {
  return JSON.parse(localStorage.getItem('user'));
}

export async function action({ request }) {
  const formData = await request.formData();
  const formDataEntries = Object.fromEntries(formData);
  const data = await registerService({
    username: formDataEntries.username,
    password: formDataEntries.password,
    email: formDataEntries.email,
    fullname: formDataEntries.fullname,
  });
  localStorage.setItem('user', JSON.stringify(data));
  return redirect('/');
}

const Register = () => {
  const [socket] = useOutletContext();
  const data = useLoaderData();
  const navigate = useNavigate();
  const [formValues, setFormValues] = React.useState({
    username: '',
    password: '',
    email: '',
    fullname: '',
  });

  React.useEffect(() => {    
    if (data !== null) {
      const { user: { username, _id, name } } = data;
      socket.auth = { user: { username, _id, name } }
      socket.connect();
      navigate('/friends');
    }
  }, [data, navigate, socket]);

  const onFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return (
    <div className="container login_container">
      <div className="login_container-header">
        <h2 className="heading heading_2">Register</h2>
          <span>or Login</span>
        </div>
      <Form method="post" className="form login_form">
        <div className="login_form-content">
          <input
            name="email"
            className="input"
            value={formValues.email}
            onChange={onFormChange}
            placeholder="Email"
          />
          <input
            name="username"
            className="input"
            value={formValues.username}
            onChange={onFormChange}
            placeholder="Username"
          />
          <input
            name="fullname"
            className="input"
            value={formValues.fullname}
            onChange={onFormChange}
            placeholder="Full name"
          />
          <input
            name="password"
            className="input"
            value={formValues.password}
            onChange={onFormChange}
            placeholder="Password"
          />
          <button type="submit" className="btn btn_login">Create</button>
        </div>
      </Form>
    </div>
  )
}

export default Register;
