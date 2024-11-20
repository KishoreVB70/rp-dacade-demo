'use client'

import React, { useState} from 'react'

import { Button } from "@/components/ui/button"
import { useAuth } from '@/lib/context/AuthContext'
import useICPAuth from '@/hooks/useICPAuth'

export default function Navbar() {
  const {loginWithInternetIdentity, logout, isLoading} = useICPAuth();
  const { principal } = useAuth();

  const handleSignInClick = async() => {
    await loginWithInternetIdentity();
  }

  const handleDisconnectWallet = async() => {
    await logout();
  }

  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-background/80 backdrop-blur-sm border-b border-border">
      <p className='font-extrabold text-xl' >Issuer Demo App</p>
      <div className="sm:w-1/3 flex justify-end">
        <div className="h-10 flex items-center">
            {principal
                ?(
                    <Button variant="outline" onClick={handleDisconnectWallet}>
                        Sign Out
                    </Button>
                )
                :(
                    <Button variant="outline" onClick={handleSignInClick}>
                        Sign In
                    </Button>
            )}
        </div>
      </div>
    </nav>
  );
}