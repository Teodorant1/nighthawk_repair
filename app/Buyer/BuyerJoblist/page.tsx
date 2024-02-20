"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/app/_trpc/client";
import { MyComponentProps } from "@/projecttypes";

const BuyerJoblist = () => {
  const [currentJob, setcurrentJob] = useState<string>("none");
  const [currentJobApplications, setcurrentJobApplications] =
    useState<string>("none");
  const { status, data: session } = useSession();
  const mypostedjobs = trpc.GetBuyerJoblist.useQuery({
    userID: session?.user.sub!,
    submitterEmail: session?.user.email!,
  });
  function toggleShow(id: string) {
    if (currentJob === id) {
      setcurrentJob("none");
    } else {
      setcurrentJob(id);
    }
  }
  function toggleShowApplications(id: string) {
    if (currentJob === id) {
      setcurrentJobApplications("none");
    } else {
      setcurrentJobApplications(id);
    }
  }
  function AppliedJobBox(IDprops: MyComponentProps) {
    const applications = trpc.GetBuyerJobApplications.useQuery({
      SubmittedJobID: IDprops.myStringProp,
      userID: session?.user.sub!,
    });

    return (
      <div className='m-5 center text-center font-bold py-2 px-4 rounded-md '>
        {" "}
        {applications.data?.length === 0 && (
          <div className='flex items-center justify-center w-[100%]'>
            <button className='m-5 center bg-green-800 text-white   text-center font-bold py-2 px-4 rounded-md '>
              NO APPLICATIONS YET
            </button>{" "}
          </div>
        )}
        {applications.data?.length! > 0 && (
          <div className='flex items-center justify-center w-[100%]'>
            {" "}
            <button className='m-5 p-5 rounded-md bg-green-800 text-white'>
              APPLICATIONS
            </button>{" "}
          </div>
        )}
        {applications.data?.length! > 0 &&
          applications.data?.map((application) => (
            <>
              {" "}
              <div
                className='flex items-center justify-center w-[100%]'
                key={application.userID}
              >
                <a
                  key={application.id}
                  href={"/Both/ProfilePage/" + application.userID}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='m-5 center bg-green-800  text-white font-bold py-2 px-4 rounded-md '
                >
                  PROFILE{""}
                </a>{" "}
              </div>
              <div className='flex items-center justify-center w-[100%]'>
                {" "}
                <button className='m-5 center bg-green-800  text-white font-bold py-2 px-4 rounded-md '>
                  E-MAIL: {application.submitterEmail}{" "}
                </button>
              </div>
            </>
          ))}
      </div>
    );
  }

  function JoblistBox() {
    const ToggleVisibilityStatus_in_db = trpc.ToggleJobVisibility.useMutation({
      onSuccess: () => {
        mypostedjobs.refetch();
      },
    });

    const handle_ToggleVisibilityStatus_in_db = async (
      SubmittedJobID: string,
      visibility: boolean
    ) => {
      try {
        ToggleVisibilityStatus_in_db.mutate({
          userID: session?.user.sub!,
          SubmittedJobID: SubmittedJobID,
          submitterEmail: session?.user.email!,
          visibility: visibility,
        });
      } catch (error) {
        console.error("Mutation failed:", error);
      }
    };

    return (
      <div>
        {mypostedjobs.data?.length! > 0 && (
          <>
            {mypostedjobs.data?.map((job) => (
              <div
                className=' overflow-x-auto m-5 center outline text-center font-bold py-2 px-4 rounded-md '
                key={job.id}
              >
                <div className='flex flex-wrap items-center justify-center w-[100%]'>
                  {" "}
                  <button className='whitespace-normal m-5 center  bg-green-800 text-white  text-center font-bold py-2 px-4 rounded-md '>
                    TITLE:{job.title}
                  </button>{" "}
                </div>
                {/* <button
                  className='m-5 center bg-green-800  text-yellow-300 text-center font-bold py-2 px-4 rounded-md '
                  onClick={() => {
                    toggleShowApplications(job.id);
                  }}
                >
                  CLICK HERE TO TOGGLE APPLICATIONS
                </button>{" "}
                <button
                  className='m-5 center bg-green-800  text-yellow-300 text-center font-bold py-2 px-4 rounded-md '
                  onClick={() => {
                    toggleShow(job.id);
                  }}
                >
                  CLICK HERE TO TOGGLE DETAILS
                </button>{" "} */}
                {job.isVisible === false && (
                  <button
                    className='m-5 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-md '
                    onClick={() => {
                      if (job.isVisible === false) {
                        handle_ToggleVisibilityStatus_in_db(job.id, true);
                      }
                      if (job.isVisible === true) {
                        handle_ToggleVisibilityStatus_in_db(job.id, false);
                      }
                    }}
                  >
                    CLICK HERE TO MAKE IT VISIBLE
                  </button>
                )}{" "}
                {job.isVisible === true && (
                  <button
                    className='m-5 center bg-green-800 text-white text-center font-bold py-2 px-4 rounded-md '
                    onClick={() => {
                      if (job.isVisible === false) {
                        handle_ToggleVisibilityStatus_in_db(job.id, true);
                      }
                      if (job.isVisible === true) {
                        handle_ToggleVisibilityStatus_in_db(job.id, false);
                      }
                    }}
                  >
                    CLICK HERE TO MAKE IT INVISIBLE
                  </button>
                )}
                <div>
                  {" "}
                  {true && (
                    <div className='w-90p flex-auto m-5 center  text-center font-bold py-2 px-4 rounded-md '>
                      {" "}
                      <div className=' whitespace-normal'>ID:{job.id}</div>
                      <div>
                        1ST TO BUY: {job.first_to_buy === true && <>true</>}
                        {job.first_to_buy === false && <>false</>}
                      </div>
                      <div>DATE OF CREATION: {String(job.date_created)}</div>
                      <div> Calculated distance: {job.distance} </div>
                      {/* <div>Email:{job.submittterEmail}</div> */}
                      <div>Expected cost: {job.moneycost}</div>
                      <div>Minimal Budget: {job.minBudget}</div>
                      <div>Maximal Budget: {job.maxBudget}</div>
                      <div>Expected duration: {job.timecost}</div>
                      <div>Timing:{job.timing}</div>
                      <div>Hiring stage:{job.hiringstage}</div>
                      {/* picture actually exists in the schema, but is an embedded object,
                     for some reason unknown to me typescript is freaking out here */}
                      <div>PICS LENGTH:{job.pictures.length}</div>
                      {job.extrainfo !== "undefined" && (
                        <div>EXTRA INFO: {job.extrainfo}</div>
                      )}{" "}
                      {/* {job.id === currentJobApplications &&
                    currentJobApplications !== "none" && ( */}
                      <AppliedJobBox myStringProp={job.id} />
                      {/* )} */}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}{" "}
      </div>
    );
  }

  return (
    <div className='m-5 center text-center font-bold py-2 px-4 rounded-md overflow-y-hidden overflow-x-hidden'>
      {session && <JoblistBox />}
    </div>
  );
};

export default BuyerJoblist;
