// https://masa-engineer-blog.com/react-state-manage-with-context/
import { createContext, useState, useContext, ReactNode } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(-1);
  const [userName, setUserName] = useState('');

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserName('');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId, setUserId, userName, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) ;
