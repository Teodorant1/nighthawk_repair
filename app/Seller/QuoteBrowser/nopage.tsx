"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { answer } from "@prisma/client";
import { useJobContext } from "./JobContext";

const IQBrowser = () => {
  // const {
  //   userLocation,
  //   setUserLocation,
  //   radius,
  //   setRadius,
  //   stage,
  //   setStage,
  //   category,
  //   setCategory,
  //   categoryArray,
  //   setCategoryArray,
  //   subCategoryArray,
  //   setSubCategoryArray,
  //   submittedJobArray,
  //   setSubmittedJobArray,
  //   submittedJobArray2,
  //   setSubmittedJobArray2,
  //   filterBoxEnabled,
  //   setFilterBoxEnabled,
  //   timingPresets,
  //   setTimingPresets,
  //   hiringStagePresets,
  //   setHiringStagePresets,
  //   currentJobID,
  //   setCurrentJobID,
  //   timingCriteria,
  //   setTimingCriteria,
  //   hiringStageCriteria,
  //   setHiringStageCriteria,
  //   budgetPresets,
  //   setBudgetPresets,
  //   minBudget,
  //   setMinBudget,
  //   maxBudget,
  //   setMaxBudget,
  //   picturesRequired,
  //   setPicturesRequired,
  //   firstTobuy,
  //   setFirstToBuy,
  // } = useJobContext();
  const context = useJobContext();

  interface parcel {
    escalationlevel: Number;
    category?: String;
    subcategory?: String;
    question?: String;
    answer?: String;
    timecost?: Number;
    moneycost?: Number;
    method?: String;
    answeredquestions?: answer[];
    extrainfo?: String;
    lat?: Number;
    long?: Number;
    radius?: Number;
    email?: String;
  }

  function isJobVisible(job: any): Boolean {
    console.log(job);
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
  useEffect(() => {
    axios.post("/api/qizztaker", parcel1).then((resp) => {
      context.setCategoryArray(resp.data);
    });
  }, []);

  async function GetData(escalationlevel: number, labelToChange?: String) {
    switch (escalationlevel) {
      case 1:
        axios.post("/api/qizztaker/v2", parcel1).then((resp) => {
          context.setCategoryArray(resp.data);
        });

      case 2:
        let parcel2: parcel = {
          escalationlevel: escalationlevel,
          category: labelToChange,
        };
        axios.post("/api/qizztaker/v2", parcel2).then((resp) => {
          console.log(resp.data);
          context.setSubCategoryArray(resp.data);
        });

      case 3:
        let parcel3: parcel = {
          escalationlevel: escalationlevel,
          category: context.category?.name,
          subcategory: labelToChange,
          lat: context.userLocation.latitude,
          long: context.userLocation.longitude,
          radius: context.radius,
        };
        axios.post("/api/qizztaker/v2", parcel3).then((resp) => {
          console.log(resp.data);
          context.setSubmittedJobArray(resp.data);
        });
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
    function toggleShow(jobid: String) {
      if (context.currentJobID !== jobid) {
        context.setCurrentJobID(jobid.toString());
      }
      if (context.currentJobID === jobid) {
        context.setCurrentJobID("");
      }
    }

    return (
      <div className='ml-3 center outline text-center font-bold py-2 px-4  rounded-md my-5'>
        A LIST OF FRESH JOBS
        {context.submittedJobArray?.length! > 0 && (
          <>
            {context.submittedJobArray!.map(
              (job) =>
                isJobVisible(job) && (
                  <div
                    className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'
                    key={job.id}
                    onClick={() => {
                      toggleShow(job.id);
                    }}
                  >
                    <div>ID:{job.id}</div>
                    <div>
                      1ST TO BUY: {job.first_to_buy === true && <>true</>}
                      {job.first_to_buy === false && <>false</>}
                    </div>
                    <div>DATE OF CREATION: {String(job.date_created)}</div>
                    <div> Calculated distance: {job.distance} </div>
                    <div>Email:{job.submittterEmail}</div>
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
                  <div> ESTIMATED COST: {Answer.moneycost}£</div>
                  <div>
                    ESTIMATED DURATION:
                    {Answer.timecost}DAYS
                  </div>
                </div>
              </div>
            ))}
          </>
        )}{" "}
      </div>
    );
  }
  function FilterBox() {
    return (
      <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
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

  console.log(context);
  return (
    <>
      <div>
        {/* <input
          className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold text-xl py-10 px-10  my-5'
          value={context.userLocationText.toString()}
          onChange={(e) => context.setUserLocationText(e.target.value)}
        />{" "} */}
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
            </button>
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
};

export default IQBrowser;
