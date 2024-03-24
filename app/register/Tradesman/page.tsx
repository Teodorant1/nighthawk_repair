"use client";

import React, { useEffect, useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { sub_category } from "@prisma/client";
import { CloudinaryResult, parcel } from "@/projecttypes";
import axios from "axios";
import { CldImage, CldUploadWidget } from "next-cloudinary";

const Details = () => {
  const [my_subcategories, setmy_subcategories] = useState<sub_category[]>([]);
  const [hiddensubcategories, sethiddensubcategories] = useState<
    sub_category[]
  >([]);
  const [stage, setstage] = useState<string>("registerScreen");
  const [licenseLink, setlicenseLink] = useState<string>("undefined");

  const [email, setemail] = useState<string>("undefined");
  const [password, setpassword] = useState<string>("undefined");
  const [phone_number, setphone_number] = useState<string>("undefined");
  const [name, setname] = useState<string>("undefined");
  const [businessName, setbusinessName] = useState<string>("undefined");
  const [businessAddress, setbusinessAddress] = useState<string>("undefined");
  const [CompanyNumber, setCompanyNumber] = useState<string>("undefined");
  const [all_subcategories, setall_subcategories] = useState<sub_category[]>(
    []
  );

  async function handle_RegisterFunction(
    email: string,
    password: string,
    phone_number: string,
    name: string,
    businessName: string,
    businessAddress: string,
    CompanyNumber: string,
    LiabilityLicense: string,
    subcategories: sub_category[]
  ) {
    let registerparcel: parcel = {
      method: "RegisterTradesman",
      email: email,
      password: password,
      phone_number: phone_number,
      name: name,
      businessName: businessName,
      businessAddress: businessAddress,
      CompanyNumber: CompanyNumber,
      LiabilityLicense: LiabilityLicense,
      subcategories: subcategories,
    };
    axios.post("/api/alttrpc", registerparcel).then((resp) => {
      console.log(resp.data);
      setstage("successfulRegistration");
    });
  }

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

  useEffect(() => {
    let allsubcatsparcel: parcel = {
      method: "getAllSubcategories",
    };

    axios.post("/api/alttrpc", allsubcatsparcel).then((resp) => {
      setall_subcategories(resp.data);
    });
  }, []);

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
          {all_subcategories.length! > 0 &&
            all_subcategories.map((subcategory) => (
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
                onClick={async () => {
                  await ActualRegistration();
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
      {stage === "registerScreen" && (
        <div className=' w-[80%] flex flex-wrap p-5 m-5  bg-green-800 bg-opacity-50 outline outline-yellow-300  text-yellow-300 '>
          <div className='m-10'>
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
              options={{
                multiple: false,
              }}
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
          <InputFields />
          <AllSubcats /> <MySubcats />
        </div>
      )}{" "}
      {stage === "successfulRegistration" && (
        <div className='m-5 center bg-green-800 text-white text-center font-bold py-20 px-20 rounded-full '>
          {" "}
          CONGRATULATIONS! YOU HAVE SUBMITTED THE REQUEST , CHECK YOUR EMAIL FOR
          OUR AUTOMATED CONFIRMATION EMAIL
        </div>
      )}
    </div>
  );
};

export default Details;
