import { useState } from 'react';
import { AuthContext } from './AuthContext';

const LOCAL_STORAGE_KEY = 'user';

export const AuthProvider = ({ children }) => {

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
  
  const login = (email, password) => {
    // ... tu lógica de fetch/axios a tu API ...
    
    // PARA UN CASO REAL NO SE DEBE GUARDAR LA CONTRASEÑA EN LOCAL STORAGE NI EN EL ESTADO
    const fakeUserData = { id: 1, name: "Usuario Ejemplo", email: email, password: password };
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fakeUserData));
    
    setUser(fakeUserData);
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    
    setUser(null);
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