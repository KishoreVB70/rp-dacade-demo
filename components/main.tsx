"use client"
import React from 'react'
import { Button } from './ui/button'
import { useAuth } from '@/lib/context/AuthContext'

const Main = () => {
  const { principal } = useAuth();
  return (
    <div className='flex flex-grow' >
      <div className='flex flex-col flex-grow justify-center items-center'>
        <h2 className="text-3xl font-bold">
          Welcome to the Issuer demo App! Obtain your <br />
          <span className='pl-8'>
            verifiable credential and test
            <a href="#" className="pl-2 text-primary hover:underline">Badgegate</a>.
          </span>
        </h2>
        {principal
          ?(<Button className='mt-10' >Get credential</Button>)
          :(<Button className='mt-10' variant='disabled'>Get credential</Button>)}
      </div>
    </div>
  )
}

export default Main