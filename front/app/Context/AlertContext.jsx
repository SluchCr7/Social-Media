
// app/Context/AlertContext.js
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Alert from '../Component/Alert'; // تأكد من المسار الصحيح

const AlertContext = createContext();

export const AlertContextProvider = ({ children }) => {
  const [notify, setNotify] = useState('');

  const showAlert = (message) => {
    setNotify(message);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Alert notify={notify} />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);