"use client";

import React from "react";

function registerUser() {
  console.log("details1");
}

const Details = () => {
  return (
    <div className='justify-items-center px-[40%]'>
      {" "}
      <input
        type='text'
        className='text-center font-bold py-2 px-4 rounded-full py-5'
        id='Email'
        placeholder='Email Goes Here'
      />{" "}
      <input
        type='password'
        className='text-center font-bold py-2 px-4 rounded-full py-5'
        id='password'
        placeholder='Password Goes Here '
      />
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full '
        onClick={() => {
          registerUser();
        }}
      >
        Click To Register as a USER
      </button>{" "}
      <button
        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full'
        onClick={() => {
          registerUser();
        }}
      >
        Click To Register as a SELLER
      </button>{" "}
    </div>
  );
};

export default Details;
