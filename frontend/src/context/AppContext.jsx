import { createContext, useState, useContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState([]); // State động cho doctors
  const currencySymbol = "$";

  const value = {
    doctors,
    setDoctors,
    currencySymbol,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

// Hook để sử dụng context
export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;