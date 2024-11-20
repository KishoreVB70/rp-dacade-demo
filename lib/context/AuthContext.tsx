"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Identity } from "@dfinity/agent";

interface AuthContextType {
  principal: string | null;
  setPrincipal: (principal: string | null) => void;
  setIdentity: (identity: Identity | null) => void;
  identity: Identity | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);

  return (
    <AuthContext.Provider value={{ principal, setPrincipal, identity, setIdentity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
