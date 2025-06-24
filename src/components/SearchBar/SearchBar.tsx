import React from 'react';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';

export const SearchBar: React.FC = () => {
    const { t } = useTranslation('translations');

    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                width: 210,
                height: 38
            }}
        >
            <InputText
                type="search"
                placeholder={t('Search') ?? ''}
                style={{
                    width: "100%",
                    paddingRight: 34, // miejsce na ikonę
                    boxSizing: "border-box",
                    height: 38
                }}
            />
            <FaSearch
                style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#aaa",
                    fontSize: 18,
                    pointerEvents: "none"
                }}
            />
        </div>
    );
};
