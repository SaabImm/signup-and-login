import { createContext, useState } from "react";
export const UserDataContext = createContext();

export default function DataProvider({ children }) {
  const [data, setData] = useState({
    token: null,
    users: [],
    message: null
  });

  return (
    <UserDataContext.Provider value={{ data, setData }}>
      {children}
    </UserDataContext.Provider>
  );
}
