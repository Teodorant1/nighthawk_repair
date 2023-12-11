"use client";

import React, { useState } from "react";
import axios from "axios";

async function registerAccount(role: string) {
  const Email = (document.getElementById("Email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;

  const phoneNum = (document.getElementById("phoneNum") as HTMLInputElement)
    ?.value;
  const name = (document.getElementById("name") as HTMLInputElement)?.value;

  const parcel = {
    email: Email,
    password: password,
    role: role,
    phoneNum: phoneNum,
    name: name,
  };

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
    <div>
      <div className='justify-items-center flex px-[40%]'>
        {" "}
        <div>
          {" "}
          Email
          <input
            type='text'
            className='outline text-center font-bold py-2 px-4 rounded-full my-5'
            id='Email'
            placeholder='Email Goes Here'
          />{" "}
        </div>
        <div>
          {" "}
          Password
          <input
            type='password'
            className='outline text-center font-bold py-2 px-4 rounded-full my-5'
            id='password'
            placeholder='Password Goes Here '
          />
        </div>{" "}
        <div>
          Phone Number
          <input
            className='outline text-center font-bold py-2 px-4 rounded-full my-5'
            type='text'
            // className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold py-10 px-10  my-5'
            id='phoneNum'
            placeholder='phoneNum goes here'
          />{" "}
        </div>{" "}
        <div>
          {" "}
          Name
          <input
            className='outline text-center font-bold py-2 px-4 rounded-full my-5'
            type='text'
            // className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold py-10 px-10  my-5'
            id='name'
            placeholder='name goes here'
          />{" "}
        </div>
      </div>{" "}
      <div className='justify-items-center flex px-[40%]'>
        {" "}
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
    </div>
  );
};

export default Details;
