import React, { useState } from 'react';

const LoginPage = ({ onLogin, onSignUp }) => {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(
            (user) => user.username === form.username && user.password === form.password);
        if (user) {
            onLogin(form.username);
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
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
            <button onClick={onSwitch}>Sign Up</button>
        </div>
    );
};

export default LoginPage;
