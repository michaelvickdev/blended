import React, { useState, createContext } from 'react';

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [regCompleted, setRegCompleted] = useState(true);
  const [changeCounter, setChangeCounter] = useState(false);

  return (
    <AuthenticatedUserContext.Provider
      value={{ user, setUser, regCompleted, setRegCompleted, changeCounter, setChangeCounter }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
