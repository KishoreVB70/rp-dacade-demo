"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { useAuth } from '@/lib/context/AuthContext'
import { getCredential } from '@/lib/services/getCredential'

const Main = () => {
  const { principal, identity } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCredentialCreated, setIsCredentialCreated] = useState<boolean>(false);

  const getCredentialAction = async() => {
    try{
      setIsLoading(true);
      await getCredential(identity);
      setIsCredentialCreated(true);
    }
    catch(error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  }
  return (
    <div className='flex flex-grow' >
      <div className='flex flex-col flex-grow justify-center items-center'>
        <h2 className="text-3xl font-bold mb-8">
          Welcome to the Issuer demo App! Obtain your <br />
          <span className='pl-8'>
            verifiable credential and test
            <a href="#" className="pl-2 text-primary hover:underline">Badgegate</a>.
          </span>
        </h2>
        {isCredentialCreated
          ?(
            <div>
              <div className="flex items-center gap-1 py-2.5 px-4 bg-[#6856C2]/10 w-fit mx-auto rounded-full text-purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M20 13C20 18 16.5 20.5 12.34 21.95C12.1222 22.0238 11.8855 22.0203 11.67 21.94C7.5 20.5 4 18 4 13V6C4 5.73478 4.10536 5.48043 4.29289 5.29289C4.48043 5.10536 4.73478 5 5 5C7 5 9.5 3.8 11.24 2.28C11.4519 2.099 11.7214 1.99955 12 1.99955C12.2786 1.99955 12.5481 2.099 12.76 2.28C14.51 3.81 17 5 19 5C19.2652 5 19.5196 5.10536 19.7071 5.29289C19.8946 5.48043 20 5.73478 20 6V13Z" stroke="#6B35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-normal">
                    You got the credential!
                </span>
              </div>
            </div>
          )
          :(
            <Button
              onClick={getCredentialAction}
              disabled={!principal}
            >
              {isLoading ? (
                <div className="w-4 h-4 mx-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                "Get Credential"
              )}
            </Button>
          )
        }
      </div>
    </div>
  )
}

export default Main