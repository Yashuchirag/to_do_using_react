import React, { useState } from "react";

export default function SignUpPage({ onSignUp, onSwitch, onGoToTodo }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const { email, password } = form;

    try {
      const res = await fetch('/.netlify/functions/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const raw = await res.text();                  // read raw text first
      let payload = {};
      try { payload = raw ? JSON.parse(raw) : {}; }  // try to parse JSON
      catch { throw new Error(`Non-JSON response (${res.status}): ${raw.slice(0,200)}`); }


      if (!res.ok) {
        throw new Error(payload.error || 'Sign up failed');
      }

      const user = payload.user;
      localStorage.setItem("currentUser", JSON.stringify(user));
      setInfo("User registered successfully");

      onSignUp?.(user);
      onGoToTodo?.();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Sign up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {info && <p style={{ color: "green" }}>{info}</p>}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />
        <button type="submit">Create account</button>
      </form>
      <p style={{ marginTop: 8 }}>
        Already have an account?{" "}
        <button onClick={onSwitch}>Log in</button>
      </p>
    </div>
  );
}
