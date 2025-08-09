import React, { useState } from "react";

export default function SignUpPage({ onSignUp, onSwitch }) {
  const [form, setForm] = useState({ username: "", password: "" });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some(u => u.username === form.username)) {
      alert("Username already exists");
      return;
    }
    users.push({ username: form.username, password: form.password });
    localStorage.setItem("users", JSON.stringify(users));
    onSignUp(form.username); // call the prop passed from App
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Sign up</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
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