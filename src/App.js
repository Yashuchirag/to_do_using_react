import React, { useState, useEffect } from 'react';
import ToDo from './ToDo';
import LoginPage from './Authentication/LoginPage';
import SignUpPage from './Authentication/SignUpPage';
import { supabase } from './utils/supabase';

const App = () => {
    const [page, setPage] = useState('login');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Listen for authentication state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setUser(session.user);
                setPage("todo");
            } else {
                setUser(null);
                setPage("login");
            }
        });

        // Check the session on initial load
        const session = supabase.auth.getSession();
        if (session) {
            setUser(session.user);
            setPage("todo");
        }

        // Clean up the listener when the component unmounts
        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    const handleLogin = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error("Login error:", error.message);
        } else {
            setUser(data.user);
            setPage("todo");
        }
    };

    const handleSignUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.error("Sign up error:", error.message);
        } else {
            setUser(data.user);
            setPage("todo");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setPage("login");
    };

    return (
        <>
            {page === "login" && (
                <LoginPage onLogin={handleLogin} onSignUp={() => setPage("signup")} />
            )}
            {page === "signup" && (
                <SignUpPage
                    onSignUp={handleSignUp}
                    onLogin={() => setPage("login")}
                />
            )}
            {page === "todo" && <ToDo user={user} onLogout={handleLogout} />}
        </>
    );
};

export default App;