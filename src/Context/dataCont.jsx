import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [authData, setAuthData] = useState({
    user: null,
    token: null
  });

  // ✅ Load authData from localStorage on refresh
  useEffect(() => {
    const stored = localStorage.getItem("authData");
    if (stored) {
      setAuthData(JSON.parse(stored));
    }
  }, []);

  // ✅ Save authData to localStorage whenever it changes
  useEffect(() => {
    if (authData.user && authData.token) {
      localStorage.setItem("authData", JSON.stringify(authData));
    } else {
      localStorage.removeItem("authData");
    }
  }, [authData]);

  // ✅ Logout
  const logout = () => {
    setAuthData({ user: null, token: null });
    localStorage.removeItem("authData");
    
  };

  return (
    <UserContext.Provider value={{ authData, setAuthData, logout }}>
      {children}
    </UserContext.Provider>
  );
}
