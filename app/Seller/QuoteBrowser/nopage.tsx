"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { answer, appliedJob } from "@prisma/client";
import { useJobContext } from "./JobContext";
import { parcel } from "@/projecttypes";

import { trpc } from "@/app/_trpc/client";

const IQBrowser = () => {
  const { status, data: session } = useSession();
  const context = useJobContext();

  const myjobs = trpc.getAggregatedJobsForUser.useQuery({
    userID: session?.user.sub!,
  });

  console.log("myjobs1", myjobs.data);

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
          // console.log("faloki1", resp.data);
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
          // console.log(resp.data);
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
                className='ml-3 center outline text-center font-bold py-2 px-4 rounded-full my-5'
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
                className='ml-3 center outline text-center font-bold py-2 px-4 rounded-full my-5 '
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
              });
          }
        });
    }

    return (
      <div className='ml-3 center outline text-center font-bold py-2 px-4  rounded-md my-5 h-screen overflow-y-auto'>
        {myjobs && myjobs?.data?.length! > 0 && (
          <>
            {myjobs!.data!.map(
              (job) =>
                isJobVisible(job) && (
                  <div
                    className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'
                    key={job.id}
                  >
                    {context.COINS > 20 && (
                      <button
                        className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                        onClick={() => {
                          BuyAlead(job.id);
                        }}
                      >
                        CLICK HERE TO APPLY
                      </button>
                    )}{" "}
                    {context.currentJobID !== job.id && (
                      <button
                        className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                        onClick={() => {
                          toggleShow(job.id);
                        }}
                      >
                        EXPAND LEAD{" "}
                      </button>
                    )}{" "}
                    {context.currentJobID === job.id && (
                      <button
                        className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                        onClick={() => {
                          toggleShow(job.id);
                        }}
                      >
                        CLOSE LEAD{" "}
                      </button>
                    )}
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
                    )}
                    {context.currentJobID === job.id && (
                      <div>
                        <AnsweredQuestionBox qstns={job.answeredQuestions} />
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
              <div key={Answer.id}>
                <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
                  {" "}
                  <div> Question: {Answer.questionID}</div>
                  <div>Answer: {Answer.text_answer}</div>
                  {/* <div> ESTIMATED COST: {Answer.moneycost}£</div>
                  <div>
                    ESTIMATED DURATION:
                    {Answer.timecost}DAYS
                  </div> */}
                </div>
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
      <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
        <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
          <h1>SORTING HAPPENS HERE</h1>
          <button
            className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            onClick={() => {
              filterSubjobs("budget", false);
            }}
          >
            {" "}
            Sort by ASCENDING VALUE{" "}
          </button>
          <button
            className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            onClick={() => {
              filterSubjobs("budget", true);
            }}
          >
            {" "}
            Sort by DESCENDING VALUE{" "}
          </button>
        </div>
        <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
          {context.firstTobuy === false && (
            <button
              onClick={() => {
                context.setFirstToBuy(true);
              }}
              className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              ENABLE FIRST TO BUY FILTER
            </button>
          )}
          {context.firstTobuy === true && (
            <button
              onClick={() => {
                context.setFirstToBuy(false);
              }}
              className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              DISABLE FIRST TO BUY FILTER
            </button>
          )}{" "}
          {context.picturesRequired === false && (
            <button
              onClick={() => {
                context.setPicturesRequired(true);
              }}
              className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              ENABLE LEADS WITH IMAGES
            </button>
          )}
          {context.picturesRequired === true && (
            <button
              onClick={() => {
                context.setPicturesRequired(false);
              }}
              className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              DISABLE LEADS WITH IMAGES
            </button>
          )}{" "}
        </div>
        <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
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
                  className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
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
                  className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                >
                  ENABLE {preset} CRITERIA
                </button>
              )}
            </div>
          ))}
        </div>
        <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
          <h1>BUDGET</h1>{" "}
          <div className='flex'>
            {" "}
            <div className='flex-1 ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
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
                      className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                    >
                      Minimal budget is set to {preset}
                    </button>
                  )}
                  {context.minBudget !== preset && (
                    <button
                      onClick={() => {
                        context.setMinBudget(preset);
                      }}
                      className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                    >
                      Set minimum budget to {preset}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className='flex-1 ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
              {" "}
              <h1>MAXIMUM BUDGET</h1>
              {context.budgetPresets.map((preset) => (
                <div key={preset.toString()}>
                  {" "}
                  {preset === context.maxBudget && (
                    <button
                      // onClick={() => {

                      // }}
                      className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                    >
                      Maximum budget is set to {preset}{" "}
                    </button>
                  )}
                  {preset !== context.maxBudget && (
                    <button
                      onClick={() => {
                        context.setMaxBudget(preset);
                      }}
                      className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
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
      <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-full my-5'>
        <h1> You can filter out jobs by radius </h1>
        {/* create a button that is mapped to the function which retrieves the users location */}
        <button
          className=' bg-blue-600  hover:bg-blue-900 ml-3  text-white center outline text-center font-bold py-2 px-4 rounded-full my-5'
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
              className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold text-xl py-10 px-10  my-5'
              id='radius'
              value={context.radius}
              onChange={(e) => context.setRadius(Number(e.target.value))}
            />{" "}
          </div>
        )}

        {context.userLocation !== null && (
          <button
            className=' bg-blue-600  hover:bg-blue-900 ml-3  text-white center outline text-center font-bold py-2 px-4 rounded-full my-5'
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
              <button
                className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
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
              <button className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'>
                AVAILABLE CREDIT: £{context.COINS}
              </button>
              <button
                onClick={() => {
                  context.setleads_to_look_at("myleads");
                }}
                className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
              >
                NUMBER OF APPLIED JOBS: {context.appliedJobs.length}
              </button>
              <div className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'>
                A LIST OF FRESH JOBS{" "}
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
    const job = trpc.getSingularJob.useQuery({
      SubmittedJobID: appliedjob.submittedJob_ID,
      userID: session?.user.sub!,
    });

    const TagAppliedJob = trpc.tag_Applied_Job.useMutation({
      onSuccess: () => {
        let appliedJobsParcel: parcel = {
          method: "getappliedjobs",
          userID: session?.user.sub,
        };
        axios.post("/api/qizztaker/v2", appliedJobsParcel).then((resp) => {
          context.setappliedJobs(resp.data);
        });
      },
    });
    const handleTagJob = async (id: string, status: string) => {
      try {
        TagAppliedJob.mutate({
          id: id,
          status: status,
          userID: session?.user.sub!,
        });
      } catch (error) {
        console.error("TagAppliedJob failed:", error);
      }
    };

    // const parcel1: parcel = {
    //   escalationlevel: 1,
    // };
    // useEffect(() => {
    //   axios.post("/api/qizztaker", parcel1).then((resp) => {
    //     console.log(resp.data);
    //   });
    // }, []);
    return (
      <div
        className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'
        key={job?.data?.subjob?.id}
      >
        {/* {context.COINS > 20 && (
      <button
        className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'

      >
        CLICK HERE TO APPLY
      </button>
    )}{" "} */}
        {context.currentJobID !== job?.data?.subjob?.id && (
          <button
            className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            onClick={() => {
              toggleShow(job?.data?.subjob?.id!);
            }}
          >
            EXPAND LEAD{" "}
          </button>
        )}{" "}
        {context.currentJobID === job?.data?.subjob?.id && (
          <button
            className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            onClick={() => {
              toggleShow(job?.data?.subjob?.id!);
            }}
          >
            CLOSE LEAD{" "}
          </button>
        )}{" "}
        {context.currentJobID === job?.data?.subjob?.id && (
          <>
            {" "}
            {context.myLead_filter_Presets.map((preset) => (
              <>
                {" "}
                {appliedjob.status === preset && preset !== "ALL" && (
                  <button
                    onClick={() => {}}
                    className='ml-3  bg-green-600 text-white center text-center font-bold py-2 px-4 rounded-full  my-5'
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
                    className='ml-3  bg-red-600 text-white center text-center font-bold py-2 px-4 rounded-full  my-5'
                  >
                    {" "}
                    TAG AS{""} {preset}
                  </button>
                )}
              </>
            ))}
          </>
        )}
        <div>CLIENT EMAIL:{job?.data?.subjob?.submittterEmail}</div>
        <div>ID:{job?.data?.subjob?.id}</div>
        <div>
          1ST TO BUY: {job?.data?.subjob?.first_to_buy === true && <>true</>}
          {job?.data?.subjob?.first_to_buy === false && <>false</>}
        </div>
        <div>DATE OF CREATION: {String(job?.data?.subjob?.date_created)}</div>
        <div> Calculated distance: {job?.data?.subjob?.distance} </div>
        {/* <div>Email:{job?.data?.subjob?.submittterEmail}</div> */}
        <div>Expected cost: {job?.data?.subjob?.moneycost}</div>
        <div>Minimal Budget: {job?.data?.subjob?.minBudget}</div>
        <div>Maximal Budget: {job?.data?.subjob?.maxBudget}</div>
        <div>Expected duration: {job?.data?.subjob?.timecost}</div>
        <div>Timing:{job?.data?.subjob?.timing}</div>
        <div>Hiring stage:{job?.data?.subjob?.hiringstage}</div>
        {/* picture actually exists in the schema, but is an embedded object,
     for some reason unknown to me typescript is freaking out here */}
        <div>PICS LENGTH:{job?.data?.subjob?.pictures.length}</div>
        {job?.data?.subjob?.extrainfo !== "undefined" && (
          <div>EXTRA INFO: {job?.data?.subjob?.extrainfo}</div>
        )}
        {context.currentJobID === job?.data?.subjob?.id && (
          <div>
            {" "}
            <AnsweredQuestionBox qstns={job?.data?.subjob?.answeredQuestions} />
          </div>
        )}
        <div></div>
      </div>
    );
  }

  function MyLeads() {
    return (
      <div>
        {" "}
        <button
          onClick={() => {
            context.setleads_to_look_at("newleads");
          }}
          className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
        >
          NUMBER OF FRESH JOBS: {myjobs?.data?.length!}
        </button>{" "}
        {context.myLead_filter_Presets.map((preset) => (
          <>
            {" "}
            {context.myLead_filter_Current_Setting === preset && (
              <button
                onClick={() => {
                  context.setmyLead_filter_Current_Setting(preset);
                }}
                className='ml-3  bg-green-600 text-white center text-center font-bold py-2 px-4 rounded-full  my-5'
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
                className='ml-3  bg-red-600 text-white center text-center font-bold py-2 px-4 rounded-full  my-5'
              >
                {" "}
                DISPLAY{""} {preset}
              </button>
            )}
          </>
        ))}
        <div className='ml-3 center text-center font-bold py-2 px-4 rounded-full  my-5'>
          <div className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'>
            MY LEADS
          </div>
          {context.appliedJobs.length > 0 && (
            <>
              {" "}
              {context.appliedJobs.map((appliedJob) => (
                <>
                  {context.myLead_filter_Current_Setting ===
                    appliedJob.status &&
                    context.myLead_filter_Current_Setting !== "ALL" && (
                      <>
                        {" "}
                        <h1>JOB ID:{appliedJob.submittedJob_ID}</h1>
                        <>
                          {" "}
                          <AppliedJobBox
                            id={appliedJob.id}
                            submittedJob_ID={appliedJob.submittedJob_ID}
                            submitterEmail={appliedJob.submitterEmail}
                            status={appliedJob.status}
                            userID={appliedJob.userID}
                          />{" "}
                        </>
                      </>
                    )}{" "}
                  {context.myLead_filter_Current_Setting === "ALL" && (
                    <>
                      {" "}
                      <h1>JOB ID:{appliedJob.submittedJob_ID}</h1>
                      <>
                        {" "}
                        <AppliedJobBox
                          id={appliedJob.id}
                          submittedJob_ID={appliedJob.submittedJob_ID}
                          submitterEmail={appliedJob.submitterEmail}
                          status={appliedJob.status}
                          userID={appliedJob.userID}
                        />{" "}
                      </>
                    </>
                  )}
                </>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {context.leads_to_look_at === "newleads" && <NewLeads />}
      {context.leads_to_look_at === "myleads" && <MyLeads />}
    </>
  );
};

export default IQBrowser;
