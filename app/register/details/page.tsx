"use client";

import React, { useState } from "react";
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
  const [userLocation, setUserLocation] = useState<any>(null);
  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setUserLocation({ latitude, longitude });
        },
        // if there was an error getting the users location
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
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
