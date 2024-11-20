'use client'

import React, { useState} from 'react'

import { Button } from "@/components/ui/button"
import { useAuth } from '@/lib/context/AuthContext'
import useICPAuth from '@/hooks/useICPAuth'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Avatar from 'boring-avatars'
import { UserMenu } from '@/components/ui/user-menu'

export default function Navbar() {
  const {loginWithInternetIdentity, logout, isLoading} = useICPAuth();
  const { principal } = useAuth();
  const avatarProp = principal ?? "Default";

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
          {isLoading
            ?<div className="animate-spin duration-500 rounded-full h-10 mr-6 py-2 w-6 border-t-2 border-gray-500"></div>
            :principal
              ?(
                <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="mr-4 h-10 w-10 p-0 rounded-full">
                  <Avatar name={avatarProp} size={40} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <UserMenu handleDisconnectWallet={handleDisconnectWallet} />
                </PopoverContent>
              </Popover>
              )
              :(
                <Button variant="outline" onClick={handleSignInClick}>
                    Sign In
                </Button>
              )
          }
        </div>
      </div>
    </nav>
  );
}