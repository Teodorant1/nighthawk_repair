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
      <div className='ml-3 center bg-green-800 text-yellow-300 text-center font-bold py-2 px-4 rounded-md my-5'>
        {" "}
        <h1 className='m-5 p-5'>APPLICATIONS</h1>{" "}
        {applications.data?.length === 0 && (
          <div className='ml-3 center bg-yellow-300 text-green-800 text-center font-bold py-2 px-4 rounded-md my-5'>
            NO APPLICATIONS YET
          </div>
        )}
        {applications.data?.length! > 0 &&
          applications.data?.map((application) => (
            <div
              className='m-5 p-5 bg-yellow-300 text-green-800'
              key={application.userID}
            >
              {" "}
              <a
                key={application.id}
                href={"/Both/ProfilePage/" + application.userID}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-3 center bg-green-800  text-yellow-300 font-bold py-2 px-4 rounded-md my-5'
              >
                CLICK HERE TO GO TO PROFILE OF USER{""}
                {application.userID}
              </a>{" "}
              <button className='ml-3 center bg-green-800  text-yellow-300 font-bold py-2 px-4 rounded-md my-5'>
                CLICK TO CONNECT{" "}
              </button>
            </div>
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
                className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'
                key={job.id}
              >
                <h1 className='ml-3 center bg-yellow-300 text-green-800 text-center font-bold py-2 px-4 rounded-md my-5'>
                  TITLE:{job.title}
                </h1>{" "}
                <button
                  className='ml-3 center bg-green-800  text-yellow-300 text-center font-bold py-2 px-4 rounded-full my-5'
                  onClick={() => {
                    toggleShowApplications(job.id);
                  }}
                >
                  CLICK HERE TO TOGGLE APPLICATIONS
                </button>{" "}
                <button
                  className='ml-3 center bg-green-800  text-yellow-300 text-center font-bold py-2 px-4 rounded-full my-5'
                  onClick={() => {
                    toggleShow(job.id);
                  }}
                >
                  CLICK HERE TO TOGGLE DETAILS
                </button>{" "}
                {job.isVisible === false && (
                  <button
                    className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
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
                    className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
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
                <div className=''>
                  {" "}
                  {true && (
                    <div className=' flex-auto ml-3 center bg-green-800  text-yellow-300 text-center font-bold py-2 px-4 rounded-md my-5'>
                      {" "}
                      <div>ID:{job.id}</div>
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
    <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
      {session && <JoblistBox />}
    </div>
  );
};

export default BuyerJoblist;
