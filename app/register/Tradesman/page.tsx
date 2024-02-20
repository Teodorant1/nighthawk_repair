"use client";

import React, { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { sub_category } from "@prisma/client";

async function registerAccount(role: string) {}

const Details = () => {
  const [my_subcategories, setmy_subcategories] = useState<sub_category[]>([]);
  const [hiddensubcategories, sethiddensubcategories] = useState<
    sub_category[]
  >([]);
  const all_subcategories = trpc.getAllSubcategories.useQuery();
  function CheckIfinMySubcats(sub_category: sub_category): boolean {
    if (
      my_subcategories.some(
        (mysubcategory) =>
          sub_category.name === mysubcategory.name &&
          sub_category.categoryID === mysubcategory.categoryID
      )
    ) {
      return false;
    }
    return true;
  }

  function MySubcats() {
    return (
      <div className='text-center justify-items-center  py-10 px-10'>
        <h1 className='py-10 text-2xl'>
          {" "}
          SUBCATEGORIES YOU SELECTED WILL SHOW UP HERE
        </h1>

        <>
          {my_subcategories.length! > 0 &&
            my_subcategories.map((subcategory) => (
              <div key={subcategory.id}>
                <button
                  className='m-5 p-5'
                  key={subcategory.name}
                >
                  {subcategory.name}
                </button>
              </div>
            ))}
        </>
      </div>
    );
  }

  function AllSubcats() {
    return (
      <div className='text-center justify-items-center   py-10 px-10'>
        <h1 className='py-10 text-2xl'> SELECT SUBCATEGORIES FROM HERE</h1>
        <div>
          {all_subcategories.data?.length! > 0 &&
            all_subcategories.data?.map((subcategory) => (
              <div key={subcategory.id}>
                {CheckIfinMySubcats(subcategory) && (
                  <button
                    className='m-5 p-5'
                    key={subcategory.name}
                    onClick={() => {
                      setmy_subcategories((current) => [
                        ...current,
                        subcategory,
                      ]);
                    }}
                  >
                    {subcategory.name}
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  }
  function InputFields() {
    return (
      <div className='text-center justify-items-center   py-10 px-10'>
        <div>
          {" "}
          <h1 className='py-10 text-2xl'> BECOME A TRADESMAN </h1>
          <div className='p-5 m-5'>
            {" "}
            <div>Email</div>
            <input
              type='text'
              className='outline text-center font-bold py-2 px-4 rounded-full m-5'
              id='Email'
              placeholder='Email Goes Here'
            />{" "}
          </div>
          <div className='p-5 m-5'>
            {" "}
            <div> Password</div>
            <input
              type='password'
              className='outline text-center font-bold py-2 px-4 rounded-full m-5'
              id='password'
              placeholder='Password Goes Here '
            />
          </div>{" "}
          <div className='p-5 m-5'>
            <div> Phone Number</div>
            <input
              className='outline text-center font-bold py-2 px-4 rounded-full m-5'
              type='text'
              // className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold py-10 px-10  m-5'
              id='phoneNum'
              placeholder='Phone Number goes here'
            />{" "}
          </div>{" "}
          <div className='p-5 m-5'>
            {" "}
            <div>Your Name</div>
            <input
              className='outline text-center font-bold py-2 px-4 rounded-full m-5'
              type='text'
              // className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold py-10 px-10  m-5'
              id='name'
              placeholder='Name goes here'
            />{" "}
            <div>Your Name</div>
            <input
              className='outline text-center font-bold py-2 px-4 rounded-full m-5'
              type='text'
              // className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold py-10 px-10  m-5'
              id='name'
              placeholder='Name goes here'
            />{" "}
            <div>Your Name</div>
            <input
              className='outline text-center font-bold py-2 px-4 rounded-full m-5'
              type='text'
              // className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold py-10 px-10  m-5'
              id='name'
              placeholder='Name goes here'
            />{" "}
            <div>Your Name</div>
            <input
              className='outline text-center font-bold py-2 px-4 rounded-full m-5'
              type='text'
              // className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold py-10 px-10  m-5'
              id='name'
              placeholder='Name goes here'
            />{" "}
            <div>
              {" "}
              <button
                className='outline outline-yellow-300  bg-green-900  text-yellow-300 font-bold m-5 py-2 px-4 rounded-full '
                onClick={() => {
                  registerAccount("USER");
                }}
              >
                Click To Register
              </button>{" "}
            </div>
          </div>
        </div>{" "}
        <div className='justify-items-center flex px-[40%]'> </div>
      </div>
    );
  }

  return (
    <div className='backgroundTools p-20 justify-items-center flex justify-center items-center h-fit'>
      {" "}
      <div className=' flex flex-wrap p-20 max-w-[90%]  bg-green-800 bg-opacity-50 outline outline-yellow-300  text-yellow-300 '>
        <InputFields /> <MySubcats /> <AllSubcats />
      </div>
    </div>
  );
};

export default Details;
