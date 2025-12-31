import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../css/register.css';

const Register = () => {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || '';

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await axios.post(`${API}/api/auth/register`, { name, email, password });
      navigate('/login');
    } catch (error) {
      setErr(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h3 className="register-title">Create an Account</h3>
        {err && <div className="alert alert-danger">{err}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label>Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-success" type="submit">Register</button>
          <div className="register-footer">
            Already registered? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
