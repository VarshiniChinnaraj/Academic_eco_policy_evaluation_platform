import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('greenCampusUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('greenCampusUser', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('greenCampusUser');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
