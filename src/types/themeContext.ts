import { ReactNode } from "react";

export interface Theme {
  backgroundColor: string;
  navbarColor: [string, string];
  fontColor: string;
}

export interface ThemeContextType {
  theme: number;
  currentTheme: Theme;
  toggleTheme: (newTheme: number) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
}
