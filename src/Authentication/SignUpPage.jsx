import React, { useState } from "react";

export default function SignUpPage({ onSignUp, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/netlify/functions/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // { email, password }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      const user = data.user;
      // persist locally so refresh keeps you signed in (matches LoginPage)
      localStorage.setItem("currentUser", JSON.stringify(user));

      setMsg(`User created: ${user.name} (id: ${user.id})`);
      onSignUp?.(user); // parent will setPage('todo')
      setForm({ email: "", password: "" });
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 360 }}>
      <h2>Sign Up</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input
          name="email"
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
        <button type="submit">Create Account</button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitch?.()}
          style={{ color: "#2563eb", textDecoration: "none", background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          Log in here
        </button>
      </p>
    </div>
  );
}
