import React, { createContext, useContext, useState, useEffect } from 'react';

// NOTE: This is a lightweight stand-in for real login.
// Once deployed, replace this with Zoho Catalyst Authentication
// (catalystApp.userManagement / Catalyst's built-in login widget)
// so student_id comes from a verified Catalyst user session instead of a text field.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('quizforge_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('quizforge_user', JSON.stringify(user));
    else localStorage.removeItem('quizforge_user');
  }, [user]);

  const login = (name, role) => {
    setUser({ id: name.toLowerCase().replace(/\s+/g, '_'), name, role });
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
