import React, { useEffect, useState } from 'react';
import ToDo from './ToDo';
import LoginPage from './Authentication/LoginPage';
import SignUpPage from './Authentication/SignUpPage';

const App = () => {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  // Boot from localStorage and keep in sync across tabs
  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const u = JSON.parse(raw);
        setUser(u);
        setPage('todo');
      }
    } catch {}

    const onStorage = (e) => {
      if (e.key === 'currentUser') {
        const u = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(u);
        setPage(u ? 'todo' : 'login');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Callbacks invoked by child pages after successful login/signup
  const handleLogin = (u) => {
    setUser(u);
    setPage('todo');
  };

  const handleSignUp = (u) => {
    setUser(u);
    setPage('todo');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setPage('login');
  };

  return (
    <>
      {page === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onSignUp={() => setPage('signup')}
          onGoToTodo={() => setPage('todo')}
        />
      )}

      {page === 'signup' && (
        <SignUpPage
          onSignUp={handleSignUp}
          onSwitch={() => setPage('login')}
          onGoToTodo={() => setPage('todo')}
        />
      )}

      {page === 'todo' && <ToDo user={user} onLogout={handleLogout} />}
    </>
  );
};

export default App;
