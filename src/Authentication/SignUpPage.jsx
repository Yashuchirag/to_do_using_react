import React, { useState } from 'react';
import {link, Route, Routes} from 'react-router-dom';
import {login} from './LoginPage';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    
    return (
        <div>
            <h1>Signup</h1>
            <form>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
}