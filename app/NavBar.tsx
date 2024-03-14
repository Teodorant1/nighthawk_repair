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
      <div className='ml-auto right-[10%]'>
        {" "}
        {status === "unauthenticated" && (
          <div className='p-5 flex flex-wrap '>
            <Link
              className=' p-2 font-bold'
              href='/register'
            >
              <button className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'>
                {" "}
                Register
              </button>
            </Link>

            <Link
              className=' p-2 font-bold'
              href='/api/auth/signin'
            >
              {" "}
              <button className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'>
                {" "}
                Login
              </button>
            </Link>
          </div>
        )}{" "}
        <div>
          {" "}
          {status === "authenticated" && (
            <div className='p-5 flex flex-wrap '>
              <Link
                className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
                href={"/Both/ProfilePage/" + session?.user.sub}
              >
                My Profile
              </Link>
              <Link
                className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
                href='/MyJobs'
              >
                My Jobs
              </Link>
              <Link
                className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
                href='/Settings'
              >
                Settings
              </Link>
              <Link
                href='/api/auth/signout'
                className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
              >
                Log Out
              </Link>{" "}
              {/* <div> {session?.user.email} </div> */}
              {/* <div
                            className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'

                onClick={() => toggleShow()}
              >
                My Account -{" "}
              </div>{" "} */}
              <div>{false && <AccountDropdown />}</div>{" "}
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
      <div className=' '>
        <Link
          className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          href={"/Both/ProfilePage/" + session?.user.sub}
        >
          My Profile
        </Link>
        <Link
          className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          href='/MyJobs'
        >
          My Jobs
        </Link>
        <Link
          className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          href='/Settings'
        >
          Settings
        </Link>
        <Link
          href='/api/auth/signout'
          className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
        >
          Log Out
        </Link>
      </div>
    );
  }
  function USERBOX() {
    return (
      <div className=''>
        <div className='p-5 flex flex-wrap'>
          <Link
            href='/Seller/QuoteBrowser'
            className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            {" "}
            QUOTE BROWSER
          </Link>
          {/* <Link
            href='/LIVELEADS'
            className=' bg-black text-white rounded-sm   text-center font-bold py-2 px-4 m-5 center'
          >
            {" "}
            LIVE LEADS
          </Link> */}
          {/* <Link
            href='/MYLEADS'
            className=' bg-black text-white rounded-sm  center  text-center font-bold py-2 px-4 m-5'
          >
            {" "}
            MY LEADS
          </Link>
          <Link
            href='/ASKANEXPERT'
            className=' bg-black text-white rounded-sm  center  text-center font-bold py-2 px-4 m-5'
          >
            ASK AN EXPERT{" "}
          </Link>{" "}
          <Link
            href='/HELP'
            className=' bg-black text-white rounded-sm  center  text-center font-bold py-2 px-4 m-5'
          >
            HELP{" "}
          </Link>{" "}
          <Link
            href='/CHAT'
            className=' bg-black text-white rounded-sm  center  text-center font-bold py-2 px-4 m-5'
          >
            CHAT{" "}
          </Link>{" "} */}
        </div>
      </div>
    );
  }

  function BUYERBOX() {
    return (
      <div className=''>
        {" "}
        <div className='p-5 flex flex-wrap'>
          {" "}
          <Link
            href='/Buyer/IQTest'
            className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            {" "}
            IQTest
          </Link>
          <Link
            href='/Buyer/BuyerJoblist'
            className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            {" "}
            My Projects
          </Link>
          {/* <Link
            href='/TrendsReport'
            className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            Trends Report
          </Link>
          <Link
            href='/Advice'
            className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            Advice
          </Link>
          <Link
            href='/MYJOBS'
            className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            {" "}
            MY JOBS{" "}
          </Link>
          <Link
            href='/TRADESPEOPLE'
            className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            {" "}
            TRADESPEOPLE
          </Link>
          <Link
            href='/CHAT'
            className=' bg-black text-white rounded-sm   text-center font-bold  py-2 px-4 m-5 center'
          >
            CHAT{" "}
          </Link> */}
        </div>
      </div>
    );
  }

  return (
    <div className='flex  bg-green-400  w-[100%] right-0 top-0'>
      {" "}
      <Link
        href='/'
        className='mr-5 w-[6%] h-[6%]'
      >
        <div className='w-[100%]'>
          {" "}
          <Image
            src={logo}
            alt='Picture of the logo'
          />
        </div>
      </Link>
      {session?.user.isRepairman && <USERBOX />}
      {session?.user.isClient && <BUYERBOX />}
      <MyAccount />
    </div>
  );
};

export default NavBar;
