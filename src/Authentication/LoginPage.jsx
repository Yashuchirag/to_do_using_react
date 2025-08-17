import React, { useState } from 'react';

const LoginPage = ({ onLogin, onSignUp }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = form;

    try {
      const res = await fetch('/netlify/functions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error || 'Login failed');
        return;
      }

      const user = payload.user;
      if (!user) {
        setError('User not found');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      onLogin?.(user);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account?</p>
      <button type="button" onClick={onSignUp}>Sign Up</button>
    </div>
  );
};

export default LoginPage;
