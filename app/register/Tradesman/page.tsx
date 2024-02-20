"use client";

import React, { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { sub_category } from "@prisma/client";
import { CloudinaryResult, parcel } from "@/projecttypes";
import axios from "axios";
import { CldImage, CldUploadWidget } from "next-cloudinary";

async function registerAccount(role: string) {}

const Details = () => {
  const [my_subcategories, setmy_subcategories] = useState<sub_category[]>([]);
  const [hiddensubcategories, sethiddensubcategories] = useState<
    sub_category[]
  >([]);
  const [stage, setstage] = useState<string>("registerScreen");
  const [licenseLink, setlicenseLink] = useState<string>("undefined");

  const RegisterFunction = trpc.RegisterTradesman.useMutation({
    onSuccess: () => {
      setstage("successfulRegistration");
    },
  });

  const handle_RegisterFunction = async (
    email: string,
    password: string,
    phone_number: string,
    name: string,
    businessName: string,
    businessAddress: string,
    CompanyNumber: string,
    LiabilityLicense: string,
    subcategories: sub_category[]
  ) => {
    try {
      RegisterFunction.mutate({
        email: email,
        password: password,
        phone_number: phone_number,
        name: name,
        businessName: businessName,
        businessAddress: businessAddress,
        CompanyNumber: CompanyNumber,
        LiabilityLicense: LiabilityLicense,
        subcategories: subcategories,
      });
    } catch (error) {
      console.error("Mutation failed:", error);
    }
  };

  async function ActualRegistration() {
    const Email = (document.getElementById("Email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const phoneNum = (document.getElementById("phoneNum") as HTMLInputElement)
      .value;
    const TradesmanName = (
      document.getElementById("TradesmanName") as HTMLInputElement
    ).value;
    const BusinessName = (
      document.getElementById("BusinessName") as HTMLInputElement
    ).value;
    const BusinessAddress = (
      document.getElementById("BusinessAddress") as HTMLInputElement
    ).value;
    const CompanyNumber = (
      document.getElementById("CompanyNumber") as HTMLInputElement
    ).value;

    await handle_RegisterFunction(
      Email,
      password,
      phoneNum,
      TradesmanName,
      BusinessName,
      BusinessAddress,
      CompanyNumber,
      licenseLink,
      my_subcategories
    );
  }

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
      <div className='text-center justify-items-center  py-2 px-2'>
        <h1 className='py-5 text-2xl'>
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
      <div className='text-center justify-items-center   py-2 px-2'>
        <h1 className='py-2 text-2xl'> SELECT SUBCATEGORIES FROM HERE</h1>
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
                    Subcategory: {subcategory.name} / Category:
                    {subcategory.categoryID}
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
      <div className='text-center justify-items-center   py-2 px-2'>
        <div>
          {" "}
          <h1 className='py-10 text-2xl'> BECOME A TRADESMAN </h1>
          <div className='p-5 m-5'>
            {" "}
            <div>Email</div>
            <input
              type='email'
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
              id='TradesmanName'
              placeholder='Tradesman name goes here'
            />{" "}
            <div>Business Name</div>
            <input
              className='outline text-center font-bold py-2 px-4 rounded-full m-5'
              type='text'
              id='BusinessName'
              placeholder='Business Name goes here'
            />{" "}
            <div>Business Address</div>
            <input
              className='outline text-center font-bold py-2 px-4 rounded-full m-5'
              type='text'
              id='BusinessAddress'
              placeholder='Business Address goes here'
            />{" "}
            <div>Company Number</div>
            <input
              className='outline text-center font-bold py-2 px-4 rounded-full m-5'
              type='text'
              id='CompanyNumber'
              placeholder='Company Number goes here'
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
      </div>
    );
  }

  return (
    <div className='backgroundTools p-5 justify-items-center flex justify-center items-center h-fit'>
      {" "}
      <div className=' flex flex-wrap p-5   bg-green-800 bg-opacity-50 outline outline-yellow-300  text-yellow-300 '>
        <div>
          {" "}
          {licenseLink !== "undefined" && (
            <CldImage
              src={licenseLink}
              alt={licenseLink}
              width={600}
              height={600}
            />
          )}
          <CldUploadWidget
            uploadPreset='bqhf0bxn'
            onUpload={(result, widget) => {
              if (result.event !== "success") {
                return;
              }
              const info = result.info as CloudinaryResult;
              setlicenseLink(info.public_id.toString());
            }}
          >
            {({ open }) => (
              <button
                onClick={() => open()}
                className='flex bg-green-800 text-white mx-auto  justify-center  font-bold py-2 px-4 rounded-sm'
              >
                Upload LIABILITY LICENSE
              </button>
            )}
          </CldUploadWidget>
        </div>
        <InputFields /> <MySubcats /> <AllSubcats />{" "}
      </div>
    </div>
  );
};

export default Details;
