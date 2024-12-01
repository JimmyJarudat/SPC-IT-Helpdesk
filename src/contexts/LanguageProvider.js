// src/context/LanguageProvider.js
"use client";
import { createContext, useContext } from 'react';
import i18n from '../i18n';
import { useTranslation, initReactI18next } from 'react-i18next';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <LanguageContext.Provider value={{ t, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);