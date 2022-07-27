import React, { useState, createContext } from 'react';

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [regCompleted, setRegCompleted] = useState(true);
  const [changeCounter, setChangeCounter] = useState(0);
  const [feedReload, setFeedReload] = useState(0);

  return (
    <AuthenticatedUserContext.Provider
      value={{
        user,
        setUser,
        regCompleted,
        setRegCompleted,
        changeCounter,
        setChangeCounter,
        feedReload,
        setFeedReload,
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
