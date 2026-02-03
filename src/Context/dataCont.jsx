import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [authData, setAuthData] = useState({
    user: null,
    token: null,
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Hydrate auth state ONCE on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");

    if (storedAuth) {
      try {
        setAuthData(JSON.parse(storedAuth));
      } catch (err) {
        console.error("Invalid authData in storage");
        localStorage.removeItem("authData");
      }
    }

    setLoading(false);
  }, []);

  // 🔹 Persist auth changes AFTER hydration
  useEffect(() => {
    if (loading) return;

    if (authData?.user && authData?.token) {
      localStorage.setItem("authData", JSON.stringify(authData));
    } else {
      localStorage.removeItem("authData");
    }
  }, [authData, loading]);

  const logout = () => {
    setAuthData({ user: null, token: null });
    localStorage.removeItem("authData");
  };

  return (
    <UserContext.Provider
      value={{
        authData,
        setAuthData,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
