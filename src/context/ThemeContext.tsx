import { createContext, FC, useMemo } from "react";
import { useLocalStorage } from "@/hooks";
import { Theme, ThemeContextType, ThemeProviderProps } from "@/types";

const themes: Theme[] = [
  {
    backgroundColor: "#e9ecf2",
    navbarColor: ["#2C84F7", "#bbcdf6"],
    fontColor: "#000000",
  },
  {
    backgroundColor: "#00040b",
    navbarColor: ["#084da1", "#010f26"],
    fontColor: "#ffffff",
  },
];

export const ThemeContext = createContext<ThemeContextType>({
  theme: 0,
  currentTheme: themes[0],
  toggleTheme: () => {},
});

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage("theme", 0);

  const toggleTheme = (newTheme: number) => {
    setTheme(newTheme);
  };

  const contextValue = useMemo(() => ({
    theme,
    currentTheme: themes[theme] || themes[0],
    toggleTheme
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
