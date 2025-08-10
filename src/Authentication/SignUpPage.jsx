import React, { useState } from "react";
import { supabase } from "../utils/supabase";

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

    const { data, error } = await supabase.rpc("register_user", { 
        p_email: email,
        p_password: password 
    });

    if (error) return setError(error.message);

    const user = data?.[0];
    
    localStorage.setItem("currentUser", JSON.stringify(user));
    setInfo("User registered successfully");

    onSignUp?.(user);
    onGoToTodo?.();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Sign up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{/* Error message */}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
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
        <button type="submit">Create account</button>
      </form>
      <p style={{ marginTop: 8 }}>
        Already have an account?{" "}
        <button onClick={onSwitch}>Log in</button>
      </p>
    </div>
  );
}