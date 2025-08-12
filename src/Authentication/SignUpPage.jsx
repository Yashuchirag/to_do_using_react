import React, { useState } from "react";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/.netlify/functions/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      setMsg(`User created: ${data.user.name} (id: ${data.user.id})`);
      setForm({ name: "", password: "" });
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
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
        />
        <input
          name="password"
          type="text"  // plain text per your request
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />
        <button type="submit">Create Account</button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#2563eb", textDecoration: "none" }}>
          Log in here
        </Link>
      </p>
    </div>
  );
}
