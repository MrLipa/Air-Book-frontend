import { useState, FC, createContext, useMemo } from "react";
import i18next from "i18next";
import cookies from "js-cookie";
import * as Flags from "country-flag-icons/react/3x2";
import { LanguageProviderProps, LanguageContextProps, FlagMap, flagStyles } from "@/types";

const flagMap: FlagMap = {
  pl: <Flags.PL style={flagStyles} />,
  en: <Flags.GB style={flagStyles} />,
  de: <Flags.DE style={flagStyles} />,
};

export const LanguageContext = createContext<LanguageContextProps>({
  language: "en",
  flag: flagMap.en,
  toggleLanguage: () => {},
});

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(cookies.get("i18next") || "en");

  const toggleLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18next.changeLanguage(newLanguage);
  };

  const contextValue = useMemo(() => ({
    language,
    flag: flagMap[language] || <></>,
    toggleLanguage,
  }), [language]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
