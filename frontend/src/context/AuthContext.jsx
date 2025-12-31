// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
  });

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (auth.token) localStorage.setItem('token', auth.token);
    else localStorage.removeItem('token');

    if (auth.user) localStorage.setItem('user', JSON.stringify(auth.user));
    else localStorage.removeItem('user');
  }, [auth]);

  const login = (token, user) => setAuth({ token, user });
  const logout = () => {
    setAuth({ token: null, user: null });
    setCartCount(0);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, cartCount, setCartCount }}>
      {children}
    </AuthContext.Provider>
  );
};
