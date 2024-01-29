"use client";

import { GetSessionParams, getSession, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/public/images/IQTlogo.png";
import { parcel } from "@/projecttypes";

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
      <div className='center outline text-center font-bold py-2 px-4   z-10 ml-auto top-[20%]  right-[10%]'>
        {" "}
        {status === "unauthenticated" && (
          <div>
            <Link
              className=' p-2 font-bold'
              href='/register'
            >
              Register
            </Link>

            <Link
              className=' p-2 font-bold'
              href='/api/auth/signin'
            >
              Login
            </Link>
          </div>
        )}{" "}
        <div>
          {" "}
          {status === "authenticated" && (
            <div className=''>
              {" "}
              {/* <div> {session?.user.email} </div> */}
              <div onClick={() => toggleShow()}>My Account - </div>{" "}
              <div>{show === true && <AccountDropdown />}</div>{" "}
            </div>
          )}
        </div>
      </div>
      // </div>
    );
  }
  function AccountDropdown() {
    return (
      <div className='ml-3 outline text-center font-bold py-2 px-4 my-5 center'>
        <Link
          className='flex p-1 font-bold'
          href='/MyJobs'
        >
          My Jobs
        </Link>
        <Link
          className='flex p-1 font-bold'
          href='/Settings'
        >
          Settings
        </Link>
        <Link
          href='/api/auth/signout'
          className='flex p-1 font-bold'
        >
          Log Out
        </Link>
      </div>
    );
  }
  function USERBOX() {
    return (
      <div className='m-5 p-5'>
        {session?.user.role === "USER" && (
          <div>
            <Link
              href='/Seller/QuoteBrowser'
              className='ml-3  text-center font-bold  py-2 px-4 rounded-full my-5 center'
            >
              {" "}
              GO TO QUOTE BROWSER
            </Link>
            <Link
              href='/FindaTrade'
              className='ml-3  text-center font-bold  py-2 px-4 rounded-full my-5 center'
            >
              {" "}
              Find a Trade
            </Link>
            <Link
              href='/Ask'
              className='ml-3 center  text-center font-bold py-2 px-4 rounded-full my-5'
            >
              {" "}
              Ask
            </Link>
            <Link
              href='/Advice'
              className='ml-3 center  text-center font-bold py-2 px-4 rounded-full my-5'
            >
              Advice
            </Link>{" "}
            <Link
              href='/LIVELEADS'
              className='ml-3  text-center font-bold py-2 px-4 rounded-full my-5 center'
            >
              {" "}
              LIVE LEADS
            </Link>
            <Link
              href='/MYLEADS'
              className='ml-3 center  text-center font-bold py-2 px-4 rounded-full my-5'
            >
              {" "}
              MY LEADS
            </Link>
            <Link
              href='/PROFILE'
              className='ml-3 center  text-center font-bold py-2 px-4 rounded-full my-5'
            >
              PROFILE{" "}
            </Link>{" "}
            <Link
              href='/MY RATINGS'
              className='ml-3 center  text-center font-bold py-2 px-4 rounded-full my-5'
            >
              MY RATINGS
            </Link>{" "}
            <Link
              href='/ASKANEXPERT'
              className='ml-3 center  text-center font-bold py-2 px-4 rounded-full my-5'
            >
              ASK AN EXPERT{" "}
            </Link>{" "}
            <Link
              href='/HELP'
              className='ml-3 center  text-center font-bold py-2 px-4 rounded-full my-5'
            >
              HELP{" "}
            </Link>{" "}
            <Link
              href='/CHAT'
              className='ml-3 center  text-center font-bold py-2 px-4 rounded-full my-5'
            >
              CHAT{" "}
            </Link>{" "}
          </div>
        )}
      </div>
    );
  }

  function BUYERBOX() {
    return (
      <div className='m-5 p-5'>
        {" "}
        {session?.user.role === "BUYER" && (
          <div>
            <Link
              href='/FindaTrade'
              className='ml-3 outline  text-center font-bold py-2  px-8 rounded-full my-5 center'
            >
              {" "}
              Find a Trade
            </Link>

            <Link
              href='/Ask'
              className='ml-3 center outline  text-center font-bold py-2  px-8 rounded-full my-5'
            >
              {" "}
              Ask
            </Link>
            <Link
              href='/TrendsReport'
              className='ml-3 center outline  text-center font-bold py-2  px-8 rounded-full my-5'
            >
              Trends Report
            </Link>
            <Link
              href='/Advice'
              className='ml-3 center outline  text-center font-bold py-2  px-8 rounded-full my-5'
            >
              Advice
            </Link>

            <Link
              href='/MYJOBS'
              className='ml-3 outline  text-center font-bold py-2  px-8 rounded-full my-5 center'
            >
              {" "}
              MY JOBS{" "}
            </Link>

            <Link
              href='/TRADESPEOPLE'
              className='ml-3 center outline  text-center font-bold py-2  px-8 rounded-full my-5'
            >
              {" "}
              TRADESPEOPLE
            </Link>
            <Link
              href='/CHAT'
              className='ml-3 center outline  text-center font-bold py-2  px-8 rounded-full my-5'
            >
              CHAT{" "}
            </Link>
            <> </>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='flex text-white bg-blue-700  h-fit w-[100%] right-0 top-0'>
      {" "}
      <Link
        href='/'
        className='mr-5 w-[10%] h-[10%]'
      >
        <div className='w-[100%]'>
          {" "}
          <Image
            src={logo}
            // width={250}
            // height={250}
            alt='Picture of the author'
          />
        </div>
      </Link>
      <USERBOX />
      <BUYERBOX />
      <MyAccount />
    </div>
  );
};

export default NavBar;
