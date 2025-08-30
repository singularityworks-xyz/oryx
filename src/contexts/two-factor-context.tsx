'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';
import TwoFactorModal from '@/components/two-factor-modal';

type TwoFactorContextType = {
  showTwoFactorModal: (onSuccess?: () => void) => void;
};

const TwoFactorContext = createContext<TwoFactorContextType | undefined>(
  undefined
);

export function TwoFactorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState<
    (() => void) | undefined
  >();

  const showTwoFactorModal = (onSuccess?: () => void) => {
    setOnSuccessCallback(() => onSuccess);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setOnSuccessCallback(undefined);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    onSuccessCallback?.();
    setOnSuccessCallback(undefined);
  };

  return (
    <TwoFactorContext.Provider value={{ showTwoFactorModal }}>
      {children}
      <TwoFactorModal
        isOpen={isOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </TwoFactorContext.Provider>
  );
}

export function useTwoFactor() {
  const context = useContext(TwoFactorContext);
  if (context === undefined) {
    throw new Error('useTwoFactor must be used within a TwoFactorProvider');
  }
  return context;
}
