"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import logo from "@/public/images/IQTlogo.png";

const NavBar = () => {
  const { status, data: session } = useSession();
  const [show, setShow] = useState(false);

  function toggleShow() {
    if (show === false) {
      setShow(true);
    }
    if (show === true) {
      setShow(false);
    }
  }

  function MyAccount() {
    return (
      // <div>
      <div className=' bg-green-800 center outline text-center font-bold py-2 px-4   z-10 ml-auto top-[10%]  right-[10%]'>
        {" "}
        {status === "unauthenticated" && (
          <div>
            <Link
              className=' p-2 font-bold'
              href='/register'
            >
              <button className=' bg-yellow-300 text-green-800 rounded-sm p-2'>
                {" "}
                Register
              </button>
            </Link>

            <Link
              className=' p-2 font-bold'
              href='/api/auth/signin'
            >
              {" "}
              <button className=' bg-yellow-300 text-green-800 rounded-sm p-2'>
                {" "}
                Login
              </button>
            </Link>
          </div>
        )}{" "}
        <div>
          {" "}
          {status === "authenticated" && (
            <div className=''>
              {" "}
              {/* <div> {session?.user.email} </div> */}
              <div
                className=' bg-yellow-300 text-green-800 rounded-sm p-2'
                onClick={() => toggleShow()}
              >
                My Account -{" "}
              </div>{" "}
              <div>{show === true && <AccountDropdown />}</div>{" "}
            </div>
          )}
        </div>
      </div>
      // </div>
    );
  }
  function AccountDropdown() {
    // const profileURL = "/Both/ProfilePage/" + session?.user.sub;

    return (
      <div className=' ml-3  text-center font-bold py-2 px-4 my-1 center'>
        <Link
          className=' bg-yellow-300 text-green-800 rounded-sm flex px-3 py-1 m-2 font-bold'
          href={"/Both/ProfilePage/" + session?.user.sub}
        >
          My Profile
        </Link>
        <Link
          className=' bg-yellow-300 text-green-800 rounded-sm flex px-3 py-1 m-2 font-bold'
          href='/MyJobs'
        >
          My Jobs
        </Link>
        <Link
          className=' bg-yellow-300 text-green-800 rounded-sm flex px-3 py-1 m-2 font-bold'
          href='/Settings'
        >
          Settings
        </Link>
        <Link
          href='/api/auth/signout'
          className=' bg-yellow-300 text-green-800 rounded-sm flex px-3 py-1 m-2 font-bold'
        >
          Log Out
        </Link>
      </div>
    );
  }
  function USERBOX() {
    return (
      <div className='m-5 p-5'>
        <div className='p-5 flex flex-wrap'>
          <Link
            href='/Seller/QuoteBrowser'
            className=' bg-yellow-300 text-green-800 rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            {" "}
            GO TO QUOTE BROWSER
          </Link>
          <Link
            href='/LIVELEADS'
            className=' bg-yellow-300 text-green-800 rounded-sm   text-center font-bold py-2 px-4 m-5 center'
          >
            {" "}
            LIVE LEADS
          </Link>
          <Link
            href='/MYLEADS'
            className=' bg-yellow-300 text-green-800 rounded-sm  center  text-center font-bold py-2 px-4 m-5'
          >
            {" "}
            MY LEADS
          </Link>
          <Link
            href='/ASKANEXPERT'
            className=' bg-yellow-300 text-green-800 rounded-sm  center  text-center font-bold py-2 px-4 m-5'
          >
            ASK AN EXPERT{" "}
          </Link>{" "}
          <Link
            href='/HELP'
            className=' bg-yellow-300 text-green-800 rounded-sm  center  text-center font-bold py-2 px-4 m-5'
          >
            HELP{" "}
          </Link>{" "}
          <Link
            href='/CHAT'
            className=' bg-yellow-300 text-green-800 rounded-sm  center  text-center font-bold py-2 px-4 m-5'
          >
            CHAT{" "}
          </Link>{" "}
        </div>
      </div>
    );
  }

  function BUYERBOX() {
    return (
      <div className='m-5 p-5'>
        {" "}
        <div className='p-5 flex flex-wrap'>
          {" "}
          <Link
            href='/FindaTrade'
            className=' bg-yellow-300 text-green-800 rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            {" "}
            Find a Trade
          </Link>
          <Link
            href='/Ask'
            className=' bg-yellow-300 text-green-800 rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            {" "}
            Ask
          </Link>
          <Link
            href='/TrendsReport'
            className=' bg-yellow-300 text-green-800 rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            Trends Report
          </Link>
          <Link
            href='/Advice'
            className=' bg-yellow-300 text-green-800 rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            Advice
          </Link>
          <Link
            href='/MYJOBS'
            className=' bg-yellow-300 text-green-800 rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            {" "}
            MY JOBS{" "}
          </Link>
          <Link
            href='/TRADESPEOPLE'
            className=' bg-yellow-300 text-green-800 rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            {" "}
            TRADESPEOPLE
          </Link>
          <Link
            href='/CHAT'
            className=' bg-yellow-300 text-green-800 rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            CHAT{" "}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='flex  bg-green-800 text-yellow-300 h-fit w-[100%] right-0 top-0'>
      {" "}
      <Link
        href='/'
        className='mr-5 w-[15%] h-[15%]'
      >
        <div className='w-[100%]'>
          {" "}
          <Image
            src={logo}
            alt='Picture of the logo'
          />
        </div>
      </Link>
      {session?.user.role === "USER" && <USERBOX />}
      {session?.user.role === "BUYER" && <BUYERBOX />}
      <MyAccount />
    </div>
  );
};

export default NavBar;
