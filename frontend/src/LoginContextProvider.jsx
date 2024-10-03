import { createContext, useState, useContext } from 'react';

// Create context
export const LoginModalContext = createContext();

// Hook to use the LoginModalContext
export const useLoginModal = () => useContext(LoginModalContext);

export const LoginModalProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <LoginModalContext.Provider value={{ isLoginModalOpen, openLoginModal, closeLoginModal }}>
      {children}
    </LoginModalContext.Provider>
  );
};
