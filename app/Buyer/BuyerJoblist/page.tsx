"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  MyComponentProps,
  parcel,
  submitted_job_WITH_Email,
} from "@/projecttypes";
import { appliedJob } from "@prisma/client";
import axios from "axios";
import { ImProfile } from "react-icons/im";
import { CiCirclePlus } from "react-icons/ci";

const BuyerJoblist = () => {
  const [currentJob, setcurrentJob] = useState<string>("none");
  const [currentJobApplications, setcurrentJobApplications] =
    useState<string>("none");
  const { status, data: session } = useSession();

  const [mypostedjobs, setmypostedjobs] = useState<submitted_job_WITH_Email[]>(
    []
  );

  useEffect(() => {
    if (status === "authenticated") {
      let mypostedjobsparcel: parcel = {
        method: "GetBuyerJoblist",
        userID: session?.user.sub,
        submitterEmail: session?.user.email,
      };

      axios.post("/api/alttrpc", mypostedjobsparcel).then((resp) => {
        // console.log(resp.data);
        setmypostedjobs(resp.data);
      });
    }
  }, [status]);

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
    const [applications, setapplications] = useState<appliedJob[]>([]);

    useEffect(() => {
      if (status === "authenticated") {
        let applicationsparcel: parcel = {
          method: "GetBuyerJobApplications",
          userID: session?.user.sub,
          SubmittedJobID: IDprops.myStringProp,
        };

        axios.post("/api/alttrpc", applicationsparcel).then((resp) => {
          // console.log(resp.data);
          setapplications(resp.data);
        });
      }
    }, []);

    return (
      <div className=' flex flex-wrap items-center justify-center w-auto center  font-bold  rounded-md '>
        {" "}
        {applications.length === 0 && (
          <div className='flex items-center justify-center w-fit'>
            <button className=' center bg-green-400 text-white font-bold my-5  p-2 rounded-md '>
              NO APPLICATIONS YET
            </button>{" "}
          </div>
        )}
        <div>
          {" "}
          {applications.length! > 0 && (
            <div
              onClick={() => {
                if (IDprops.myStringProp !== currentJobApplications) {
                  setcurrentJobApplications(IDprops.myStringProp);
                } else if (IDprops.myStringProp === currentJobApplications) {
                  setcurrentJobApplications("  ");
                }
              }}
              className='flex flex-wrap items-center justify-center w-fit'
            >
              {" "}
              <button className='flex items-center justify-center content m-2 p-2 rounded-md bg-green-400 text-white'>
                APPLICATIONS - {applications.length}{" "}
                <CiCirclePlus className='ml-2 w-8 h-8' />
              </button>{" "}
            </div>
          )}{" "}
          {currentJobApplications === IDprops.myStringProp && (
            <div>
              {" "}
              {applications.length! > 0 &&
                applications.map((application) => (
                  <div
                    className='flex'
                    key={application.userID}
                  >
                    {" "}
                    <div className='flex flex-wrap items-center justify-center'>
                      <a
                        key={application.id}
                        href={"/Both/ProfilePage/" + application.userID}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='m-2 center bg-blue-400  text-white font-bold p-2 rounded-md '
                      >
                        <ImProfile />
                        {""}
                      </a>{" "}
                    </div>
                    <div className='flex items-center justify-center'>
                      {" "}
                      <div className='m-2 center bg-green-400  text-white font-bold p-2 rounded-md '>
                        {application.submitterEmail}{" "}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function JoblistBox() {
    async function handle_ToggleVisibilityStatus_in_db(
      SubmittedJobID: string,
      visibility: boolean
    ) {
      let handle_ToggleVisibilityStatus_in_db_parcel: parcel = {
        method: "ToggleJobVisibility",
        userID: session?.user.sub,
        visibility: visibility,
        submitterEmail: session?.user.email,
        SubmittedJobID: SubmittedJobID,
      };
      axios
        .post("/api/alttrpc", handle_ToggleVisibilityStatus_in_db_parcel)
        .then((resp) => {
          setmypostedjobs(resp.data);
        });
    }

    return (
      <div className='flex flex-wrap'>
        {mypostedjobs.length! > 0 && (
          <>
            {mypostedjobs.map((job) => (
              <div
                className='w-fit m-2  outline  font-bold p-2 rounded-md '
                key={job.id}
              >
                <div className='items-center justify-center'>
                  {" "}
                  <button className='w-fit whitespace-normal m-3 center  bg-green-400 text-white   font-bold p-2 rounded-md '>
                    TITLE:{job.title}
                  </button>{" "}
                </div>
                {/* <button
                  className='m-3 center bg-green-400  text-yellow-300  font-bold p-2 rounded-md '
                  onClick={() => {
                    toggleShowApplications(job.id);
                  }}
                >
                  CLICK HERE TO TOGGLE APPLICATIONS
                </button>{" "}
                <button
                  className='m-3 center bg-green-400  text-yellow-300  font-bold p-2 rounded-md '
                  onClick={() => {
                    toggleShow(job.id);
                  }}
                >
                  CLICK HERE TO TOGGLE DETAILS
                </button>{" "} */}
                {job.isVisible === false && (
                  <button
                    className='m-3 center bg-red-400 text-white  font-bold p-2 rounded-md '
                    onClick={() => {
                      if (job.isVisible === false) {
                        handle_ToggleVisibilityStatus_in_db(job.id, true);
                      }
                      if (job.isVisible === true) {
                        handle_ToggleVisibilityStatus_in_db(job.id, false);
                      }
                    }}
                  >
                    TOGGLE VISIBILITY
                  </button>
                )}{" "}
                {job.isVisible === true && (
                  <button
                    className='m-3 center bg-green-400 text-white  font-bold p-2 rounded-md '
                    onClick={() => {
                      if (job.isVisible === false) {
                        handle_ToggleVisibilityStatus_in_db(job.id, true);
                      }
                      if (job.isVisible === true) {
                        handle_ToggleVisibilityStatus_in_db(job.id, false);
                      }
                    }}
                  >
                    TOGGLE VISIBILITY
                  </button>
                )}
                <div>
                  {" "}
                  {true && (
                    <div className=' m-3 center   font-bold rounded-md '>
                      {" "}
                      {/* <div className='flex flex-wrap items-center justify-center w-full bg-green-400 text-white rounded-sm'> */}
                      <div> ID:{job.id}</div>
                      <div>
                        1ST TO BUY: {job.first_to_buy === true && <>true</>}
                        {job.first_to_buy === false && <>false</>}
                      </div>
                      <div>DATE OF CREATION: {String(job.date_created)}</div>
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
                      <div>
                        <AppliedJobBox myStringProp={job.id} />
                      </div>
                      {/* {job.id === currentJobApplications &&
                        currentJobApplications !== "none" && (
                          <div>
                            <AppliedJobBox myStringProp={job.id} />
                          </div>
                        )} */}
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
    <div className='m-3 center  font-bold p-2 rounded-md'>
      {session?.user.isClient === true && <JoblistBox />}
    </div>
  );
};

export default BuyerJoblist;
