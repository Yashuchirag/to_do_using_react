import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

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
        const { data, error } = await supabase.rpc("login_user", { 
            p_email: email,
            p_password: password 
        });

        if (error) {
            setError(error.message);
            return;
        }

        const user = data?.[0];
        if (!user) {
            setError("User not found");
            return;
        }
        
        localStorage.setItem("currentUser", JSON.stringify(user));
        onLogin?.(user);
        onGoToTodo?.();
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
            <button onClick={onSignUp}>Sign Up</button>
        </div>
    );
};

export default LoginPage;
