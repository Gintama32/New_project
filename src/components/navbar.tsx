'use client';
import React from 'react'
import Link from "next/link"

import { User } from 'next-auth'
import { Button } from './ui/button';
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className='p-4 md:p-6 shadow-md align-center justify-center'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <a href="/" className="text-xl font-bold mb-4 md:mb-0">Message</a>
        {
          session ? (
            <>
              <span className="mr-4">Welcome, {user.username || user?.email}</span>
              <Button onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="w-full md:w-auto">Login</Button>
            </Link>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar;
