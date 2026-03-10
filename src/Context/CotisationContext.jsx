import { createContext, useState } from 'react';

export const CotisationContext = createContext();

export const CotisationProvider = ({ children }) => {
  const [data, setData] = useState({ cotisations: [] });
  return (
    <CotisationContext.Provider value={{ data, setData }}>
      {children}
    </CotisationContext.Provider>
  );
};