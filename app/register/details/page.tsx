"use client";

import React from "react";
import axios from "axios";
import { env } from "process";

async function registerAccount(role: string) {
  const Email = (document.getElementById("Email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;

  const parcel = {
    email: Email,
    password: password,
    role: role,
  };
  console.log(env.NEXTAUTH_URL);

  axios
    .post("/api/registration", parcel)
    // .then((resp) => {
    //   const receivedinfo = resp.data;
    //   console.log(receivedinfo);
    // })
    .catch((error) => console.log(error));
}

const Details = () => {
  return (
    <div className='justify-items-center px-[40%]'>
      {" "}
      <input
        type='text'
        className='outline text-center font-bold py-2 px-4 rounded-full my-5'
        id='Email'
        placeholder='Email Goes Here'
      />{" "}
      <input
        type='password'
        className='outline text-center font-bold py-2 px-4 rounded-full my-5'
        id='password'
        placeholder='Password Goes Here '
      />
      <button
        className=' bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2 px-4 rounded-full '
        onClick={() => {
          registerAccount("USER");
        }}
      >
        Click To Register as a USER
      </button>{" "}
      <button
        className='bg-green-500 hover:bg-green-700 text-white font-bold my-5 py-2 px-4 rounded-full'
        onClick={() => {
          registerAccount("BUYER");
        }}
      >
        Click To Register as a BUYER
      </button>{" "}
    </div>
  );
};

export default Details;
