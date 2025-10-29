import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const LOCAL_STORAGE_KEY = 'user';

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Error al leer usuario de localStorage", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    
    return null;
  });
  
  const login = (id, role) => {
    const user = { id: id,  role: role };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    setUser(user);
  };

  const logout = (url) => {
    if (!url) url = "";
    navigate(`/login${url}`, { replace: true });

    setTimeout(() => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setUser(null);
    }, 1);
  };

  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};