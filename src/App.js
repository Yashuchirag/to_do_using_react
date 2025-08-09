import React, { useState, useEffect } from 'react';
import TableOfContents from './Functionalities/TableOfContents';
import LoginPage from './Authentication/LoginPage';
import SignUpPage from './Authentication/SignUpPage';


const App = () => {
    const [page, setPage] = useState('login');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setPage("todo");
        }
    }, [user]);

    const handleLogin = (username) => {
        setUser({ username });
        localStorage.setItem("user", JSON.stringify({ username }));
        setPage("todo");
      };
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        setPage("login");
      };

    return (
        <>
      {page === "login" && (
        <LoginPage onLogin={handleLogin} onSwitch={() => setPage("signup")} />
      )}
      {page === "signup" && (
        <SignUpPage onSignup={handleLogin} onSwitch={() => setPage("login")} />
      )}
      {page === "todo" && <TableOfContents user={user} onLogout={handleLogout} />}
    </>
    );
}

export default App;
