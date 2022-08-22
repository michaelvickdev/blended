import React, { useState, createContext, useRef } from 'react';

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [regCompleted, setRegCompleted] = useState(true);
  const [changeCounter, setChangeCounter] = useState(0);
  const [feedReload, setFeedReload] = useState(0);
  const [paymentCounter, setPaymentCounter] = useState(0);
  const [signUpCounter, setSignUpCounter] = useState(0);
  const unsubscribe = useRef(null);
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
        paymentCounter,
        setPaymentCounter,
        unsubscribe,
        signUpCounter,
        setSignUpCounter,
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
