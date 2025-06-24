import { ReactNode, CSSProperties } from "react";

export interface LanguageProviderProps {
  children: ReactNode;
}

export interface LanguageContextProps {
  language: string;
  flag: JSX.Element;
  toggleLanguage: (newLanguage: string) => void;
}

export type FlagMap = Record<string, JSX.Element>;

export const flagStyles: CSSProperties = {
  width: "40px",
  height: "30px",
};
