import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Estado para almacenar nuestro valor
  // Pasar la función inicial al useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Retornar una versión envuelta de la función setter de useState
  const setValue = value => {
    try {
      // Permitir que el valor sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage; 