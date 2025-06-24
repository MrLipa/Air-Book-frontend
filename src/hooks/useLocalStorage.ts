import {useState, useEffect} from 'react';

function getSavedValue(key: string, initialValue: any) {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
      return JSON.parse(savedValue);
    }
  
    return initialValue;
  }

export function useLocalStorage(key: string, initialValue: any) {
    const [value, setValue] = useState(() =>{
        return getSavedValue(key, initialValue)
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    },[value]);

    return [value, setValue]
}
