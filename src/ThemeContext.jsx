import { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("luxury");

  const cycleTheme = () => {
    setTheme((prev) =>
      prev === "luxury" ? "frost" : prev === "frost" ? "candy" : "luxury"
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
