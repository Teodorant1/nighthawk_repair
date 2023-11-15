"use client";

import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const NavBar = () => {
  const { status, data: session } = useSession();

  // cons session = await getServerSession(authOptions)

  return (
    <div className='flex bg-slate-200 p-10 space-x-10'>
      <Link
        href='/'
        className='mr-5'
      >
        Next.js
      </Link>
      <Link href='/users'>Users</Link>
      {status === "authenticated" && (
        <div className='flex px-10'>
          <div>{session.user.email}</div>/<div>{session.user.role}</div>
          <Link
            href='/api/auth/signout'
            className='ml-3'
          >
            Sign Out
          </Link>
        </div>
      )}
      {status === "unauthenticated" && (
        <>
          <Link href='/register'>Register</Link>

          <Link href='/api/auth/signin'>Login</Link>
        </>
      )}
    </div>
  );
};

export default NavBar;
