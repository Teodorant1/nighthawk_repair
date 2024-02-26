"use client";
import { trpc } from "@/app/_trpc/client";
import { parcel, tradesmanCandidateWSubcategories } from "@/projecttypes";
import { tradesmanCandidate } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import React, { useEffect, useState } from "react";

const CANDIDATELIST = () => {
  const { status, data: session } = useSession();

  const [candidates, setcandidates] = useState<
    tradesmanCandidateWSubcategories[]
  >([]);

  useEffect(() => {
    let GetTradesManCandidateListparcel: parcel = {
      method: "GetTradesManCandidateList",
    };

    axios.post("/api/alttrpc", GetTradesManCandidateListparcel).then((resp) => {
      console.log(resp.data);
      setcandidates(resp.data);
    });
  }, []);

  async function handle_CanditateTradesmanApproval_action(
    tradesmanID: string,
    isApproved: boolean
  ) {
    let handle_CanditateTradesmanApproval_actionparcel: parcel = {
      method: "handleCandidateTradesmanApproval",
      tradesmanID: tradesmanID,
      isApproved: isApproved,
    };

    axios
      .post("/api/alttrpc", handle_CanditateTradesmanApproval_actionparcel)
      .then((resp) => {
        setcandidates(resp.data);
      });
    // .then(() => {
    //   let GetTradesManCandidateListparcel: parcel = {
    //     method: "GetTradesManCandidateList",
    //   };

    //   axios
    //     .post("/api/profileEditor", GetTradesManCandidateListparcel)
    //     .then((resp) => {
    //       setcandidates(resp.data);
    //     });
    // });
  }

  return (
    <div>
      <div
        onClick={() => {
          console.log(candidates.length);
        }}
      >
        CANDIDATELIST {candidates.length}
      </div>
      {session?.user.isAdmin === true && candidates?.length! > 0 && (
        <div>
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className=' bg-green-800 text-white p-5 m-5'
            >
              <div>
                {" "}
                <button
                  onClick={async () => {
                    await handle_CanditateTradesmanApproval_action(
                      candidate.id,
                      true
                    );
                  }}
                  className='bg-blue-800 m-5 p-5'
                >
                  APPROVE
                </button>{" "}
                <button
                  onClick={async () => {
                    await handle_CanditateTradesmanApproval_action(
                      candidate.id,
                      false
                    );
                  }}
                  className='bg-red-800  m-5 p-5 '
                >
                  REJECT AND DELETE
                </button>{" "}
              </div>
              <div className='flex flex-wrap'>
                {" "}
                <div>
                  {" "}
                  <div className='p-5 m-5'>EMAIL :{candidate.email}</div>{" "}
                  <div className='p-5 m-5'>NAME :{candidate.name}</div>{" "}
                  <div className='p-5 m-5'>
                    Company number : {candidate.CompanyNumber}
                  </div>{" "}
                  <div className='p-5 m-5'>
                    PHONE NUMBER : {candidate.phoneNumber}
                  </div>{" "}
                  <div className='p-5 m-5'>
                    Business Name : {candidate.BusinessName}
                  </div>{" "}
                  <div className='p-5 m-5'>
                    Business Address: {candidate.BusinessAddress}
                  </div>{" "}
                </div>{" "}
                <div>
                  {" "}
                  {candidate.LiabilityLicenseLink !== "undefined" && (
                    <div>
                      <div>
                        {" "}
                        <CldImage
                          src={candidate.LiabilityLicenseLink}
                          alt={candidate.LiabilityLicenseLink}
                          width={1000}
                          height={1000}
                        />
                      </div>{" "}
                    </div>
                  )}
                </div>{" "}
                <div className='p-5 m-5'>
                  {candidate.SubCategories.length > 0 &&
                    candidate.SubCategories.map((subcategory) => (
                      <div
                        className="'p-5 m-5"
                        key={subcategory.id}
                      >
                        {" "}
                        {subcategory.SubCategory}/Category:
                        {subcategory.categoryID}{" "}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CANDIDATELIST;
