"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { answer, appliedJob } from "@prisma/client";
import { useJobContext } from "./JobContext";
import {
  parcel,
  submitted_job_SANS_Email,
  submitted_job_WITH_Email,
} from "@/projecttypes";
import { CldImage } from "next-cloudinary";
import { FaArrowCircleDown } from "react-icons/fa";
import { CiFilter, CiCirclePlus } from "react-icons/ci";
import { IoCloseCircleSharp } from "react-icons/io5";

import ImageCarousel from "@/components/ImageCarousel";

const IQBrowser = () => {
  const { status, data: session } = useSession();
  const context = useJobContext();

  const [myjobs, setmyjobs] = useState<submitted_job_SANS_Email[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      let myjobsparcel: parcel = {
        method: "getAggregatedJobsForUser",
        userID: session?.user.sub,
      };
      axios.post("/api/alttrpc", myjobsparcel).then((resp) => {
        setmyjobs(resp.data);
      });
    }
  }, [status]);

  useEffect(() => {
    axios.post("/api/qizztaker", parcel1).then((resp) => {
      context.setCategoryArray(resp.data);
    });
  }, []);
  useEffect(() => {
    if (status === "authenticated") {
      let coinparcel: parcel = {
        method: "getCoins",
        userID: session?.user.sub,
      };

      axios
        .post("/api/qizztaker/v2", coinparcel)
        .then((resp) => {
          context.setCOINS(resp.data.coins);
        })
        .then(() => {
          GetappliedJobs();
        });
    }
  }, [status]);
  function toggleShow(jobid: string) {
    if (context.currentJobID !== jobid) {
      context.setCurrentJobID(jobid);
    }
    if (context.currentJobID === jobid) {
      context.setCurrentJobID("");
    }
  }
  async function GetappliedJobs() {
    let appliedJobsParcel: parcel = {
      method: "getappliedjobs",
      userID: session?.user.sub,
    };
    axios.post("/api/qizztaker/v2", appliedJobsParcel).then((resp) => {
      // console.log(resp.data);
      context.setappliedJobs(resp.data);
    });
  }
  function isJobVisible(job: any): Boolean {
    if (
      context.appliedJobs.some(
        (appliedjob) => appliedjob.submittedJob_ID === job.id
      )
    ) {
      return false;
    }

    if (context.firstTobuy === true) {
      if (job.first_to_buy === false) {
        return false;
      }
    }
    if (context.picturesRequired === true) {
      if (job.pictures.length === 0) {
        return false;
      }
    }
    if (
      context.hiringStageCriteria.includes(job.hiringstage!) &&
      context.timingCriteria.includes(job.timing!) &&
      context.minBudget <= job.minBudget! &&
      context.maxBudget >= job.maxBudget!
    ) {
      return true;
    }
    return false;
  }

  const parcel1: parcel = {
    escalationlevel: 1,
  };

  async function GetData(escalationlevel: number, labelToChange?: string) {
    switch (escalationlevel) {
      case 1:
        axios.post("/api/qizztaker/v2", parcel1).then((resp) => {
          context.setCategoryArray(resp.data);
        });
        break;

      case 2:
        let parcel2: parcel = {
          escalationlevel: escalationlevel,
          category: labelToChange,
        };
        axios.post("/api/qizztaker/v2", parcel2).then((resp) => {
          context.setSubCategoryArray(resp.data);
        });
        break;

      case 3:
        // if (labelToChange === "faloki") {
        // }
        let parcel3: parcel = {
          escalationlevel: escalationlevel,
          category: context.category?.name,
          subcategory: labelToChange,
          lat: context.userLocation.latitude,
          long: context.userLocation.longitude,
          radius: context.radius,
        };
        axios.post("/api/qizztaker/v2", parcel3).then((resp) => {
          context.setSubmittedJobArray(resp.data);
        });
        break;

      case 4:
    }
  }

  function CategoryBOX() {
    return (
      <div>
        PICK A CATEGORY
        {context.categoryArray?.length! > 0 && (
          <>
            {context.categoryArray!.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  context.setCategory(category);
                  context.setStage(2);
                  GetData(2, category.name);
                }}
                className='m-3 center  text-center font-bold p-2 rounded-md'
              >
                {category.name}
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
  function SubcategoryBOX() {
    return (
      <div>
        PICK A SUBCATEGORY{" "}
        {context.subCategoryArray?.length! > 0 && (
          <>
            {context.subCategoryArray!.map((sub_category) => (
              <div
                key={sub_category.id}
                onClick={() => {
                  // setsub_category(sub_category);
                  context.setStage(3);
                  GetData(3, sub_category!.name);
                }}
                className='m-3 center  text-center font-bold p-2 rounded-md '
              >
                {sub_category.name}
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
  interface AnQue {
    qstns: string;
  }

  function JOBbox() {
    async function BuyAlead(jobID: string) {
      let coinparcel: parcel = {
        method: "BuyAlead",
        userID: session?.user.sub,
        leadID: jobID,
      };

      axios
        .post("/api/qizztaker/v2", coinparcel)

        .then(() => {
          if (status === "authenticated") {
            let coinparcel: parcel = {
              method: "getCoins",
              userID: session?.user.sub,
            };

            axios
              .post("/api/qizztaker/v2", coinparcel)
              .then((resp) => {
                context.setCOINS(resp.data.coins);
              })
              .then(async () => {
                await GetappliedJobs();
              })
              .then(async () => {
                let myjobsparcel: parcel = {
                  method: "getAggregatedJobsForUser",
                  userID: session?.user.sub,
                };

                axios.post("/api/alttrpc", myjobsparcel).then((resp) => {
                  setmyjobs(resp.data);
                });
              });
          }
        });
    }

    return (
      <div className=' m-5 center flex flex-wrap text-center font-bold p-10  rounded-md'>
        {myjobs.length! > 0 && (
          <>
            {myjobs.map(
              (job) =>
                isJobVisible(job) && (
                  <div
                    className='h-fit m-3 center outline text-center font-bold p-2 rounded-md'
                    key={job.id}
                  >
                    <div className='flex items-center justify-center'>
                      {" "}
                      {context.currentJobID !== job.id && (
                        <button
                          className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-md'
                          onClick={() => {
                            toggleShow(job.id);
                          }}
                        >
                          <CiCirclePlus className='w-8 h-8' />
                        </button>
                      )}{" "}
                      {context.currentJobID === job.id && (
                        <button
                          className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-md'
                          onClick={() => {
                            toggleShow(job.id);
                          }}
                        >
                          <IoCloseCircleSharp className='w-8 h-8' />
                        </button>
                      )}
                    </div>
                    <h1>TITLE:{job?.title}</h1>
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
                    {job.pictures && (
                      <div>PICS LENGTH:{job.pictures.length}</div>
                    )}
                    {job.extrainfo !== "undefined" && (
                      <div>EXTRA INFO: {job.extrainfo}</div>
                    )}
                    {context.currentJobID === job.id && (
                      <div>
                        {" "}
                        <div>
                          <AnsweredQuestionBox qstns={job.answeredQuestions} />
                        </div>
                        <div className='flex flex-wrap p-2 m-2'>
                          {job.pictures && (
                            <div className='flex flex-wrap'>
                              {" "}
                              {job.pictures.length > 0 && (
                                <>
                                  <ImageCarousel images={job.pictures} />
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {context.COINS > 20 && (
                      <button
                        className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-md'
                        onClick={() => {
                          BuyAlead(job.id);
                        }}
                      >
                        APPLY
                      </button>
                    )}{" "}
                    <div></div>
                  </div>
                )
            )}
          </>
        )}
      </div>
    );
  }

  function AnsweredQuestionBox(AnQue: AnQue) {
    const [AnswerArray, setAnswerArray] = useState<answer[]>(
      JSON.parse(AnQue.qstns)
    );

    return (
      <div>
        {" "}
        {AnswerArray?.length! > 0 && (
          <div className='flex flex-wrap'>
            {AnswerArray!.map((Answer) => (
              <div
                key={Answer.id}
                className='flex flex-wrap'
              >
                <div>
                  <div className='bg-green-400 text-white m-3 center  text-center font-bold p-2 rounded-md'>
                    {" "}
                    <div> Question: {Answer.questionID}</div>
                    <div>Answer: {Answer.text_answer}</div>
                    <div> ESTIMATED COST: {Answer.moneycost}£</div>
                    <div>
                      ESTIMATED DURATION:
                      {Answer.timecost}DAYS
                    </div>
                  </div>
                </div>{" "}
              </div>
            ))}
          </div>
        )}{" "}
      </div>
    );
  }
  function FilterBox() {
    function filterSubjobs(column: String, descending: boolean): void {
      if (column === "budget") {
        if (descending === true) {
          const valueDescending = [...context.submittedJobArray].sort(
            (a, b) => b.moneycost - a.moneycost
          );
          context.setSubmittedJobArray(valueDescending);
        }
        if (descending === false) {
          const valueAscending = [...context.submittedJobArray].sort(
            (a, b) => a.moneycost - b.moneycost
          );
          context.setSubmittedJobArray(valueAscending);
        }
      }
    }

    return (
      <div className='flex  justify-center m-3 center flex-wrap text-center font-bold p-3 w-full h-fit'>
        <div className='m-3 center w-[15%] text-center font-bold p-2 rounded-md'>
          <h1>SORT BY</h1>{" "}
          <div className='m-3 center  text-center font-bold p-2 rounded-md'>
            <div
              className='m-3 center bg-blue-400 text-white text-center font-bold p-5 rounded-md'
              onClick={() => {
                filterSubjobs("budget", false);
              }}
            >
              {" "}
              ASCENDING VALUE{" "}
            </div>
            <div
              className='m-3 center bg-blue-400 text-white text-center font-bold p-5 rounded-md'
              onClick={() => {
                filterSubjobs("budget", true);
              }}
            >
              {" "}
              DESCENDING VALUE{" "}
            </div>
          </div>{" "}
          <div className='m-3 center  text-center  font-bold p-4 rounded-md'>
            <h1>Enabled Filters</h1>
            {/* {context.firstTobuy === false && (
              <div
                onClick={() => {
                  context.setFirstToBuy(true);
                }}
                className='m-3 center bg-red-400 text-white text-center font-bold p-2 rounded-md'
              >
                ENABLE FIRST TO BUY FILTER
              </div>
            )}
            {context.firstTobuy === true && (
              <div
                onClick={() => {
                  context.setFirstToBuy(false);
                }}
                className='m-3 center bg-green-600 text-white text-center font-bold p-2 rounded-md'
              >
                DISABLE FIRST TO BUY FILTER
              </div>
            )}{" "} */}
            {context.picturesRequired === false && (
              <div
                onClick={() => {
                  context.setPicturesRequired(true);
                }}
                className='m-3 center bg-red-400 text-white text-center font-bold p-2 rounded-md'
              >
                ENABLE LEADS WITH IMAGES
              </div>
            )}
            {context.picturesRequired === true && (
              <div
                onClick={() => {
                  context.setPicturesRequired(false);
                }}
                className='m-3 center bg-green-600 text-white text-center font-bold p-2 rounded-md'
              >
                DISABLE LEADS WITH IMAGES
              </div>
            )}{" "}
          </div>
        </div>

        <div className='m-3 center w-[15%] text-center font-bold p-2 rounded-md'>
          <h1>TIMING</h1>{" "}
          {context.timingPresets.map((preset) => (
            <div key={preset.toString()}>
              {" "}
              {context.timingCriteria.includes(preset) === true && (
                <button
                  onClick={() => {
                    const newcriteria = context.timingCriteria.filter(
                      (preset1) => preset1 !== preset
                    );
                    context.setTimingCriteria(newcriteria);
                  }}
                  className='m-3 center bg-green-600 text-white text-center font-bold p-2 rounded-md'
                >
                  DISABLE {preset} CRITERIA
                </button>
              )}
              {context.timingCriteria.includes(preset) === false && (
                <button
                  onClick={() => {
                    const newcriteria = [...context.timingCriteria, preset];
                    context.setTimingCriteria(newcriteria);
                  }}
                  className='m-3 center bg-red-400 text-white text-center font-bold p-2 rounded-md'
                >
                  ENABLE {preset} CRITERIA
                </button>
              )}
            </div>
          ))}
        </div>
        <div className='flex-1  center  text-center font-bold  rounded-md'>
          <div className='flex '>
            {" "}
            <div className='flex-1 w-[10%] m-1 center  text-center font-bold p-1 rounded-md'>
              {" "}
              <h1
                onClick={() => {
                  context.setcurrentdropdown("minbudget");
                }}
                className=' flex outline items-center justify-center'
              >
                MINIMAL BUDGET <FaArrowCircleDown />
                <div className='ml-2'>{context.minBudget}</div>
              </h1>
              {context.currentdropdown === "minbudget" && (
                <div className=' relative top-5'>
                  {" "}
                  {context.budgetPresets.map((preset) => (
                    <div key={preset.toString()}>
                      {" "}
                      {/* {context.minBudget === preset && (
                    <button
                      // onClick={() => {
                      //   setminbudget(preset);
                      // }}
                      className='m-3 center bg-green-600 text-white text-center font-bold p-2 rounded-md'
                    >
                      Minimal budget is set to {preset}
                    </button>
                  )} */}
                      {context.minBudget !== preset && (
                        <button
                          onClick={() => {
                            context.setMinBudget(preset);
                            context.setcurrentdropdown("");
                          }}
                          className='my-1 p-2 w-full hover:bg-blue-600 hover:text-white center outline text-center font-bold '
                        >
                          Set minimum budget to {preset}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='flex-1 w-[10%] m-1 center  text-center font-bold p-1 rounded-md'>
              {" "}
              <h1
                onClick={() => {
                  context.setcurrentdropdown("maxbudget");
                }}
                className=' flex outline items-center justify-center'
              >
                MAXIMUM BUDGET <FaArrowCircleDown />
                <div className='ml-5'>{context.maxBudget}</div>
              </h1>
              {context.currentdropdown === "maxbudget" && (
                <div className=' relative top-5'>
                  {context.budgetPresets.map((preset) => (
                    <div key={preset.toString()}>
                      {" "}
                      {preset !== context.maxBudget && (
                        <button
                          onClick={() => {
                            context.setMaxBudget(preset);
                            context.setcurrentdropdown("");
                          }}
                          className='my-1 p-2 z-10 w-full hover:bg-blue-600 hover:text-white center outline text-center font-bold '
                        >
                          {preset}{" "}
                        </button>
                      )}
                      {/* {preset !== context.maxBudget && (
                        <button
                          onClick={() => {
                            context.setMaxBudget(preset);
                            context.setcurrentdropdown("minbudget");
                          }}
                          className='m-3 center  text-center font-bold p-2 rounded-md'
                        >
                          Set maximum budget to {preset}
                        </button>
                      )} */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Geolocatatrix = () => {
    const getUserLocation = () => {
      // if geolocation is supported by the users browser
      if (navigator.geolocation) {
        // get the current users location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // save the geolocation coordinates in two variables
            const { latitude, longitude } = position.coords;
            // update the value of userlocation variable
            context.setUserLocation({ latitude, longitude });
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
      <div className='m-3 center  text-center font-bold p-2 rounded-md'>
        <h1> You can filter out jobs by radius </h1>
        {/* create a button that is mapped to the function which retrieves the users location */}
        <button
          className=' bg-blue-600  hover:bg-blue-900 m-3  text-white center  text-center font-bold p-2 rounded-md'
          onClick={getUserLocation}
        >
          Load User Location
        </button>
        {/* if the user location variable has a value, print the users location */}
        {context.userLocation && (
          <div>
            <h2>User Location</h2>
            <p>Latitude: {context.userLocation.latitude} </p>
            <p>Longitude: {context.userLocation.longitude}</p>
            RADIUS
            {/* {radius} */}
            <input
              type='number'
              className='mx-[20%] w-[50%] h-[10%]  text-center font-bold text-xl py-10 px-10 '
              id='radius'
              value={context.radius}
              onChange={(e) => context.setRadius(Number(e.target.value))}
            />{" "}
          </div>
        )}

        {context.userLocation !== null && (
          <button
            className=' bg-blue-600  hover:bg-blue-900 m-3  text-white center  text-center font-bold p-2 rounded-md'
            onClick={() => {
              context.setStage(1);
            }}
          >
            Proceed to next step
          </button>
        )}
      </div>
    );
  };

  function NewLeads() {
    return (
      <>
        <div className=' flex flex-wrap items-center justify-center w-screen'>
          {context.stage === 3 && (
            <div className='flex flex-wrap items-center justify-center w-screen'>
              <div className='flex flex-wrap items-center justify-center w-screen'>
                <button
                  className='flex items-center justify-center m-3 center  -white text-white  bg-green-400  text-center font-bold p-2 rounded-md'
                  onClick={() => {
                    if (context.filterBoxEnabled === false) {
                      context.setFilterBoxEnabled(true);
                    } else {
                      context.setFilterBoxEnabled(false);
                    }
                  }}
                >
                  <CiFilter />
                  FILTERS
                </button>{" "}
                <button className='m-3 center  -whit text-white  bg-green-400  text-center font-bold p-2 rounded-md'>
                  AVAILABLE CREDIT: £{context.COINS}
                </button>
                <button
                  onClick={() => {
                    context.setleads_to_look_at("myleads");
                  }}
                  className='m-3 center  -white  text-white bg-green-400   text-center font-bold p-2 rounded-md'
                >
                  APPLIED JOBS: {context.appliedJobs.length}
                </button>
              </div>
              <div className='flex flex-wrap items-center justify-center w-screen'>
                {" "}
                {/* <div
                  onClick={() => {

                  }}
                  className=' m-3 center  -white text-white bg-green-400   text-center font-bold p-2 rounded-md'
                >
                  A LIST OF FRESH JOBS {myjobs.length}
                </div> */}
              </div>

              {context.filterBoxEnabled === true && <FilterBox />}
            </div>
          )}
          {context.stage === 0 && <Geolocatatrix />}
          {context.stage === 1 && <CategoryBOX />}
          {context.stage === 2 && <SubcategoryBOX />}
          {context.stage === 3 && <JOBbox />}
        </div>
      </>
    );
  }

  function AppliedJobBox(appliedjob: appliedJob) {
    const [job, setjob] = useState<submitted_job_WITH_Email>();
    useEffect(() => {
      let myjobsparcel: parcel = {
        method: "getSingularJob",
        SubmittedJobID: appliedjob.submittedJob_ID,
        userID: session?.user.sub,
      };

      axios.post("/api/alttrpc", myjobsparcel).then((resp) => {
        setjob(resp.data);
      });
    }, []);

    async function handleTagJob(id: string, status: string) {
      let tagjobparcel: parcel = {
        method: "tag_Applied_Job",
        userID: session?.user.sub,
        id: id,
        status: status,
      };
      axios.post("/api/alttrpc", tagjobparcel).then((resp) => {
        let appliedJobsParcel: parcel = {
          method: "getappliedjobs",
          userID: session?.user.sub,
        };
        axios.post("/api/qizztaker/v2", appliedJobsParcel).then((resp) => {
          context.setappliedJobs(resp.data);
        });
      });
    }

    return (
      <div
        className='m-3 center text-center font-bold p-2 rounded-md '
        key={job?.id}
      >
        {job && (
          <div className='outline p-5'>
            {" "}
            {context.currentJobID !== job?.id && (
              <button
                className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-md'
                onClick={() => {
                  //console.log(job);
                  toggleShow(job?.id!);
                }}
              >
                <CiCirclePlus className='w-8 h-8' />
              </button>
            )}{" "}
            {context.currentJobID === job?.id && (
              <button
                className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-md'
                onClick={() => {
                  toggleShow(job?.id!);
                }}
              >
                <IoCloseCircleSharp className='w-8 h-8' />
              </button>
            )}{" "}
            {context.currentJobID === job?.id && (
              <>
                {" "}
                {context.myLead_filter_Presets.map((preset) => (
                  <>
                    {" "}
                    {appliedjob.status === preset && preset !== "ALL" && (
                      <button
                        onClick={() => {}}
                        className='m-3  bg-green-600 text-white center text-center font-bold p-2 rounded-md '
                      >
                        {" "}
                        {preset}
                      </button>
                    )}{" "}
                    {appliedjob.status !== preset && preset !== "ALL" && (
                      <button
                        onClick={async () => {
                          await handleTagJob(appliedjob.id, preset);
                        }}
                        className='m-3  bg-red-400 text-white center text-center font-bold p-2 rounded-md '
                      >
                        {" "}
                        TAG AS{""} {preset}
                      </button>
                    )}
                  </>
                ))}
              </>
            )}
            <div className='flex items-center justify-center'>
              {" "}
              <div className=' flex items-center justify-center w-full rounded bg-green-400 text-white p-2'>
                ID:{job?.id}
              </div>
            </div>
            <h1>TITLE:{job?.title}</h1>
            <div>CLIENT EMAIL:{job?.submittterEmail}</div>
            <div>Postal Code: {}</div>
            <div>DATE OF CREATION: {String(job?.date_created)}</div>
            <div> Calculated distance: {job?.distance} </div>
            {/* <div>Email:{job?.submittterEmail}</div> */}
            <div>Expected cost: {job?.moneycost}</div>
            <div>Minimal Budget: {job?.minBudget}</div>
            <div>Maximal Budget: {job?.maxBudget}</div>
            <div>Expected duration: {job?.timecost}</div>
            <div>Timing:{job?.timing}</div>
            <div>Hiring stage:{job?.hiringstage}</div>
            {/* picture actually exists in the schema, but is an embedded object,
     for some reason unknown to me typescript is freaking out here */}
            {job.pictures && <div>PICS LENGTH:{job.pictures.length}</div>}{" "}
            {job?.extrainfo !== "undefined" && (
              <div>EXTRA INFO: {job?.extrainfo}</div>
            )}
            <div>
              {" "}
              {job.pictures && (
                <>
                  {" "}
                  {context.currentJobID === job?.id &&
                    job.pictures.length > 0 && (
                      <div className='flex items-center justify-center w-full'>
                        <ImageCarousel images={job.pictures} />
                      </div>
                    )}
                </>
              )}
            </div>
            {/* {context.currentJobID === job?.id && (
              <div className='flex flex-wrap'>
                {" "}
                <AnsweredQuestionBox qstns={job?.answeredQuestions} />
              </div>
            )} */}
          </div>
        )}
      </div>
    );
  }

  function MyLeads() {
    return (
      <div className=' items-center justify-center w-screen'>
        <div className=' items-center justify-center p-5 m-5'>
          {" "}
          <div className='flex items-center justify-center w-screen'>
            {" "}
            <button
              onClick={() => {
                context.setleads_to_look_at("newleads");
              }}
              className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-md'
            >
              GO TO FRESH JOBS
            </button>{" "}
          </div>{" "}
          <div className='flex items-center justify-center w-screen'>
            {" "}
            {context.myLead_filter_Presets.map((preset) => (
              <div key={preset}>
                {" "}
                {context.myLead_filter_Current_Setting === preset && (
                  <button
                    onClick={() => {
                      context.setmyLead_filter_Current_Setting(preset);
                    }}
                    className='m-3  bg-green-600 text-white center text-center font-bold p-2 rounded-md '
                  >
                    {" "}
                    {preset}
                  </button>
                )}{" "}
                {context.myLead_filter_Current_Setting !== preset && (
                  <button
                    onClick={() => {
                      context.setmyLead_filter_Current_Setting(preset);
                    }}
                    className='m-3  bg-red-400 text-white center text-center font-bold p-2 rounded-md '
                  >
                    {" "}
                    DISPLAY{""} {preset}
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className='m-3 center text-center font-bold p-2 rounded-md '>
            <div className='flex items-center justify-center'>
              <div className='m-3 center text-center font-bold p-2 rounded-md'>
                MY LEADS
              </div>{" "}
            </div>

            {context.appliedJobs.length === 0 && (
              <div className='flex items-center justify-center'>
                <div className='m-3 center text-center font-bold p-2 rounded-md'>
                  NO JOBS{" "}
                </div>{" "}
              </div>
            )}
            <div className='flex flex-wrap'>
              {" "}
              {context.appliedJobs.length > 0 && (
                <div
                  className="flex flex-wrap m-3 center text-center font-bold p-2 rounded-md'
            "
                >
                  {" "}
                  {context.appliedJobs.map((appliedJob) => (
                    <div
                      className='m-3 center text-center font-bold p-2 rounded-md'
                      key={appliedJob.id}
                    >
                      {context.myLead_filter_Current_Setting ===
                        appliedJob.status &&
                        context.myLead_filter_Current_Setting !== "ALL" && (
                          <>
                            {" "}
                            <>
                              {" "}
                              <AppliedJobBox
                                id={appliedJob.id}
                                submittedJob_ID={appliedJob.submittedJob_ID}
                                submitterEmail={appliedJob.submitterEmail}
                                status={appliedJob.status}
                                userID={appliedJob.userID}
                                dateCreated={appliedJob.dateCreated}
                              />{" "}
                            </>
                          </>
                        )}{" "}
                      {context.myLead_filter_Current_Setting === "ALL" && (
                        <>
                          {" "}
                          <>
                            {" "}
                            <AppliedJobBox
                              id={appliedJob.id}
                              submittedJob_ID={appliedJob.submittedJob_ID}
                              submitterEmail={appliedJob.submitterEmail}
                              status={appliedJob.status}
                              userID={appliedJob.userID}
                              dateCreated={appliedJob.dateCreated}
                            />{" "}
                          </>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {session?.user.isRepairman === true && (
        <div className='flex flex-wrap items-center justify-center w-screen m-5 p-5'>
          {" "}
          {context.leads_to_look_at === "newleads" && <NewLeads />}
          {context.leads_to_look_at === "myleads" && <MyLeads />}
        </div>
      )}
    </>
  );
};

export default IQBrowser;
