import React, { useState } from 'react';

const SignUpPage = ({onSignup, onLogin}) => {
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
        let users = JSON.parse(localStorage.getItem('users')||[]);
        if (users.some(
            (user) => user.username === form.username)) {
                alert('User already exists');
                return;
            }
        users.push({username: form.username, password: form.password});
        localStorage.setItem('users', JSON.stringify(users));
        onSignup(form.username);
    };

    return (
        <div>
            <h1>Sign Up</h1>
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
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onLogin(); }} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Login</a></p>
        </div>
    );
}

export default SignUpPage;
