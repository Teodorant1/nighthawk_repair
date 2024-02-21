"use client";
import { trpc } from "@/app/_trpc/client";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import React from "react";

const CANDIDATELIST = () => {
  const { status, data: session } = useSession();
  const candidates = trpc.GetTradesManCandidateList.useQuery();
  const CanditateTradesmanApprovalfunc =
    trpc.handleCandidateTradesmanApproval.useMutation({
      onSuccess: () => {
        candidates.refetch();
      },
    });

  const handle_CanditateTradesmanApproval_action = async (
    tradesmanID: string,
    IsApproved: boolean
  ) => {
    try {
      CanditateTradesmanApprovalfunc.mutate({
        tradesmanID: tradesmanID,
        IsApproved: IsApproved,
      });
    } catch (error) {
      console.error("Mutation failed:", error);
    }
  };

  return (
    <div>
      <>CANDIDATELIST</>
      {session?.user.isAdmin === true && candidates.data?.length! > 0 && (
        <div>
          {candidates.data?.map((candidate) => (
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
