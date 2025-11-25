import { useState, createContext } from "react";

export const SearchBarContext = createContext();

export default function InputContexte({ children }) {
  const [keyWord, setKeyWord] = useState("");
  const [selectedRole, setSelectedRole] = useState("all"); // new

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") setSelectedRole(value);
    else setKeyWord(value);
  };

  return (
    <SearchBarContext.Provider value={{ keyWord, selectedRole, handleChange }}>
      {children}
    </SearchBarContext.Provider>
  );
}
