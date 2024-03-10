"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { answer, appliedJob, submitted_job } from "@prisma/client";
import { useJobContext } from "./JobContext";
import {
  parcel,
  submitted_job_SANS_Email,
  submitted_job_WITH_Email,
} from "@/projecttypes";

import { trpc } from "@/app/_trpc/client";
import { CldImage } from "next-cloudinary";

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
      console.log(myjobsparcel);
      axios.post("/api/alttrpc", myjobsparcel).then((resp) => {
        console.log("getAggregatedJobsForUser", resp.data);
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
      context.setCurrentJobID(jobid.toString());
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
                className='m-3 center  text-center font-bold p-2 rounded-full'
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
                className='m-3 center  text-center font-bold p-2 rounded-full '
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
                  console.log("nested then");
                  console.log(resp.data);
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
                    className='m-3 center outline text-center font-bold p-2 rounded-md'
                    key={job.id}
                  >
                    {context.COINS > 20 && (
                      <button
                        className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-full'
                        onClick={() => {
                          BuyAlead(job.id);
                        }}
                      >
                        CLICK HERE TO APPLY
                      </button>
                    )}{" "}
                    {context.currentJobID !== job.id && (
                      <button
                        className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-full'
                        onClick={() => {
                          toggleShow(job.id);
                        }}
                      >
                        EXPAND LEAD{" "}
                      </button>
                    )}{" "}
                    {context.currentJobID === job.id && (
                      <button
                        className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-full'
                        onClick={() => {
                          toggleShow(job.id);
                        }}
                      >
                        CLOSE LEAD{" "}
                      </button>
                    )}
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
                          {job.pictures.length > 0 && (
                            <>
                              {job.pictures.map((picture) => (
                                <div
                                  className='m-2 p-2'
                                  key={picture.id}
                                >
                                  <CldImage
                                    src={picture.cloudinaryID}
                                    width={300}
                                    height={200}
                                    alt={picture.cloudinaryID}
                                  />
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    )}
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
          <>
            {AnswerArray!.map((Answer) => (
              <div
                key={Answer.id}
                className='flex flex-wrap items-center justify-center w-screen'
              >
                <div>
                  <div className='bg-green-400 text-white m-3 center  text-center font-bold p-2 rounded-md'>
                    {" "}
                    <div> Question: {Answer.questionID}</div>
                    <div>Answer: {Answer.text_answer}</div>
                    {/* <div> ESTIMATED COST: {Answer.moneycost}£</div>
                  <div>
                    ESTIMATED DURATION:
                    {Answer.timecost}DAYS
                  </div> */}
                  </div>
                </div>{" "}
              </div>
            ))}
          </>
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
      <div className='m-3 center flex flex-wrap text-center font-bold p-2'>
        <div className='m-3 center  text-center font-bold p-2 rounded-md'>
          <h1>SORT BY</h1>{" "}
          <div className='m-3 center  text-center font-bold p-2 rounded-md'>
            <div
              className='m-3 center bg-red-400 text-white text-center font-bold p-2 rounded-full'
              onClick={() => {
                filterSubjobs("budget", false);
              }}
            >
              {" "}
              Sort by ASCENDING VALUE{" "}
            </div>
            <div
              className='m-3 center bg-red-400 text-white text-center font-bold p-2 rounded-full'
              onClick={() => {
                filterSubjobs("budget", true);
              }}
            >
              {" "}
              Sort by DESCENDING VALUE{" "}
            </div>
          </div>{" "}
          <div className='m-3 center  text-center  font-bold p-4 rounded-md'>
            <h1>Enabled Filters</h1>
            {context.firstTobuy === false && (
              <div
                onClick={() => {
                  context.setFirstToBuy(true);
                }}
                className='m-3 center bg-red-400 text-white text-center font-bold p-2 rounded-full'
              >
                ENABLE FIRST TO BUY FILTER
              </div>
            )}
            {context.firstTobuy === true && (
              <div
                onClick={() => {
                  context.setFirstToBuy(false);
                }}
                className='m-3 center bg-green-600 text-white text-center font-bold p-2 rounded-full'
              >
                DISABLE FIRST TO BUY FILTER
              </div>
            )}{" "}
            {context.picturesRequired === false && (
              <div
                onClick={() => {
                  context.setPicturesRequired(true);
                }}
                className='m-3 center bg-red-400 text-white text-center font-bold p-2 rounded-full'
              >
                ENABLE LEADS WITH IMAGES
              </div>
            )}
            {context.picturesRequired === true && (
              <div
                onClick={() => {
                  context.setPicturesRequired(false);
                }}
                className='m-3 center bg-green-600 text-white text-center font-bold p-2 rounded-full'
              >
                DISABLE LEADS WITH IMAGES
              </div>
            )}{" "}
          </div>
        </div>

        <div className='m-3 center  text-center font-bold p-2 rounded-md'>
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
                  className='m-3 center bg-green-600 text-white text-center font-bold p-2 rounded-full'
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
                  className='m-3 center bg-red-400 text-white text-center font-bold p-2 rounded-full'
                >
                  ENABLE {preset} CRITERIA
                </button>
              )}
            </div>
          ))}
        </div>
        <div className='m-3 center  text-center font-bold p-2 rounded-md'>
          <div className='flex'>
            {" "}
            <div className='flex-1 m-3 center  text-center font-bold p-2 rounded-md'>
              {" "}
              <h1>MINIMAL BUDGET</h1>
              {context.budgetPresets.map((preset) => (
                <div key={preset.toString()}>
                  {" "}
                  {context.minBudget === preset && (
                    <button
                      // onClick={() => {
                      //   setminbudget(preset);
                      // }}
                      className='m-3 center bg-green-600 text-white text-center font-bold p-2 rounded-full'
                    >
                      Minimal budget is set to {preset}
                    </button>
                  )}
                  {context.minBudget !== preset && (
                    <button
                      onClick={() => {
                        context.setMinBudget(preset);
                      }}
                      className='m-3 center bg-red-400 text-white text-center font-bold p-2 rounded-full'
                    >
                      Set minimum budget to {preset}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className='flex-1 m-3 center  text-center font-bold p-2 rounded-md'>
              {" "}
              <h1>MAXIMUM BUDGET</h1>
              {context.budgetPresets.map((preset) => (
                <div key={preset.toString()}>
                  {" "}
                  {preset === context.maxBudget && (
                    <button
                      // onClick={() => {

                      // }}
                      className='m-3 center bg-green-600 text-white text-center font-bold p-2 rounded-full'
                    >
                      Maximum budget is set to {preset}{" "}
                    </button>
                  )}
                  {preset !== context.maxBudget && (
                    <button
                      onClick={() => {
                        context.setMaxBudget(preset);
                      }}
                      className='m-3 center bg-red-400 text-white text-center font-bold p-2 rounded-full'
                    >
                      Set maximum budget to {preset}
                    </button>
                  )}
                </div>
              ))}
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
      <div className='m-3 center  text-center font-bold p-2 rounded-full'>
        <h1> You can filter out jobs by radius </h1>
        {/* create a button that is mapped to the function which retrieves the users location */}
        <button
          className=' bg-blue-600  hover:bg-blue-900 m-3  text-white center  text-center font-bold p-2 rounded-full'
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
            className=' bg-blue-600  hover:bg-blue-900 m-3  text-white center  text-center font-bold p-2 rounded-full'
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
        <div>
          {context.stage === 3 && (
            <div>
              <div className='flex flex-wrap items-center justify-center w-screen'>
                <button
                  className='m-3 center  -white text-white  bg-green-400  text-center font-bold p-2 rounded-full'
                  onClick={() => {
                    if (context.filterBoxEnabled === false) {
                      context.setFilterBoxEnabled(true);
                    } else {
                      context.setFilterBoxEnabled(false);
                    }
                  }}
                >
                  FILTERS
                </button>{" "}
                <button className='m-3 center  -whit text-white  bg-green-400  text-center font-bold p-2 rounded-full'>
                  AVAILABLE CREDIT: £{context.COINS}
                </button>
                <button
                  onClick={() => {
                    context.setleads_to_look_at("myleads");
                  }}
                  className='m-3 center  -white  text-white bg-green-400   text-center font-bold p-2 rounded-full'
                >
                  NUMBER OF APPLIED JOBS: {context.appliedJobs.length}
                </button>
              </div>
              <div className='flex flex-wrap items-center justify-center w-screen'>
                {" "}
                {/* <div
                  onClick={() => {
                    console.log(myjobs);
                  }}
                  className=' m-3 center  -white text-white bg-green-400   text-center font-bold p-2 rounded-full'
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
        method: "GetBuyerJobApplications",
        userID: session?.user.sub,
      };

      axios.post("/api/alttrpc", myjobsparcel).then((resp) => {
        // console.log(resp.data);
        setjob(resp.data);
      });
    }, []);

    async function handleTagJob(id: string, status: string) {
      let tagjobparcel: parcel = {
        method: "tag_Applied_Job",
        userID: session?.user.id,
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
        className='m-3 center outline  text-center font-bold p-2 rounded-md break-words'
        key={job?.id}
      >
        {job && (
          <>
            {" "}
            {context.currentJobID !== job?.id && (
              <button
                className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-full'
                onClick={() => {
                  toggleShow(job?.id!);
                }}
              >
                EXPAND LEAD{" "}
              </button>
            )}{" "}
            {context.currentJobID === job?.id && (
              <button
                className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-full'
                onClick={() => {
                  toggleShow(job?.id!);
                }}
              >
                CLOSE LEAD{" "}
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
                        className='m-3  bg-green-600 text-white center text-center font-bold p-2 rounded-full '
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
                        className='m-3  bg-red-400 text-white center text-center font-bold p-2 rounded-full '
                      >
                        {" "}
                        TAG AS{""} {preset}
                      </button>
                    )}
                  </>
                ))}
              </>
            )}
            <div className='flex items-center justify-center w-screen'>
              {" "}
              <div className=' rounded bg-green-400 text-white px-14 py-5'>
                ID:{job?.id}
              </div>
            </div>
            <h1>TITLE:{job?.title}</h1>
            <div>CLIENT EMAIL:{job?.submittterEmail}</div>
            <div>
              1ST TO BUY: {job?.first_to_buy === true && <>true</>}
              {job?.first_to_buy === false && <>false</>}
            </div>
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
              {context.currentJobID === job?.id && job.pictures.length > 0 && (
                <div className='flex flex-wrap'>
                  {job.pictures.map((picture) => (
                    <div
                      className='m-2 p-2'
                      key={picture.id}
                    >
                      <CldImage
                        src={picture.cloudinaryID}
                        width={300}
                        height={200}
                        alt={picture.cloudinaryID}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {context.currentJobID === job?.id && (
              <div>
                {" "}
                <AnsweredQuestionBox qstns={job?.answeredQuestions} />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  function MyLeads() {
    return (
      <div className=' flex flex-wrap items-center justify-center w-screen'>
        {" "}
        <button
          onClick={() => {
            context.setleads_to_look_at("newleads");
          }}
          className='m-3 center bg-green-400 text-white text-center font-bold p-2 rounded-full'
        >
          GO TO FRESH JOBS
        </button>{" "}
        {context.myLead_filter_Presets.map((preset) => (
          <div key={preset}>
            {" "}
            {context.myLead_filter_Current_Setting === preset && (
              <button
                onClick={() => {
                  context.setmyLead_filter_Current_Setting(preset);
                }}
                className='m-3  bg-green-600 text-white center text-center font-bold p-2 rounded-full '
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
                className='m-3  bg-red-400 text-white center text-center font-bold p-2 rounded-full '
              >
                {" "}
                DISPLAY{""} {preset}
              </button>
            )}
          </div>
        ))}
        <div className='m-3 center text-center font-bold p-2 rounded-full '>
          <div className='flex items-center justify-center w-screen'>
            <div className='m-3 center text-center font-bold p-2 rounded-full'>
              MY LEADS
            </div>{" "}
          </div>
          {context.appliedJobs.length === 0 && (
            <div className='flex items-center justify-center w-screen'>
              <div className='m-3 center text-center font-bold p-2 rounded-full'>
                NO JOBS{" "}
              </div>{" "}
            </div>
          )}
          {context.appliedJobs.length > 0 && (
            <>
              {" "}
              {context.appliedJobs.map((appliedJob) => (
                <div key={appliedJob.id}>
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
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {session?.user.isRepairman === true && (
        <>
          {" "}
          {context.leads_to_look_at === "newleads" && <NewLeads />}
          {context.leads_to_look_at === "myleads" && <MyLeads />}
        </>
      )}
    </>
  );
};

export default IQBrowser;
