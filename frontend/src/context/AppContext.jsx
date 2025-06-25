import { createContext } from "react";
import { useDoctors } from "../hooks/useDoctors";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const { doctors, loading, error } = useDoctors();
  const currencySymbol = "$";

  const value = {
    doctors,
    loading,
    error,
    currencySymbol,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;