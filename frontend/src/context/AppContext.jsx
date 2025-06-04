import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const doctors = generateDoctors(30);
  const currencySymbol = "$";


  const value = {
    doctors,
    currencySymbol,
  };


  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;