"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  question,
  answer,
  category,
  sub_category,
  submitted_job,
} from "@prisma/client";
const IQBrowser = () => {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [radius, setradius] = useState<number>(25);
  const [stage, setstage] = useState<number>(0);
  const [category, setcategory] = useState<category>();
  const [category_Array, setcategory_Array] = useState<category[]>();
  // const [sub_category, setsub_category] = useState<sub_category>();
  const [sub_category_Array, setsub_category_Array] =
    useState<sub_category[]>();
  const [submittedJob_Array, setsubmittedJob_Array] = useState<submitted_job[]>(
    []
  );
  const [submittedJob_Array2, setsubmittedJob_Array2] = useState<
    submitted_job[]
  >([]);
  const [filterBoxEnabled, setfilterBoxEnabled] = useState<boolean>(false);

  const [timingPRESETS, settimingPRESETS] = useState<String[]>([
    "URGENTLY",
    "WITHIN 2 DAYS",
    "WITHIN 2 WEEKS",
    "WITHIN 2 MONTHS",
    "2 MONTHS+",
    "FLEXIBLE START DATE",
  ]);
  const [hiringstagePRESETS, sethiringstagePRESETS] = useState<String[]>([
    "Ready to hire",
    "Insurance Quote",
  ]);
  const [currentJobID, setcurrentJobID] = useState<String>("1");
  const [timingCriteria, settimingCriteria] = useState<String[]>([
    "URGENTLY",
    "WITHIN 2 DAYS",
    "WITHIN 2 WEEKS",
    "WITHIN 2 MONTHS",
    "2 MONTHS+",
    "FLEXIBLE START DATE",
  ]);
  const [hiringstageCriteria, sethiringstageCriteria] = useState<String[]>([
    "Ready to hire",
    "Insurance Quote",
  ]);
  const [budgetPRESETS, setbudgetPRESETS] = useState<number[]>([
    0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000,
  ]);
  // const [minbudgetPRESETS, setminbudgetPRESETS] = useState<number[]>([
  //   0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000,
  // ]);
  // const [maxbudgetPRESETS, setmaxbudgetPRESETS] = useState<number[]>([
  //   0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000,
  // ]);
  const [minbudget, setminbudget] = useState<number>(0);
  const [maxbudget, setmaxbudget] = useState<number>(30000);
  const [pictureseRequired, setpictureseRequired] = useState<boolean>(false);
  const [firstTobuy, setfirstTobuy] = useState<boolean>(false);

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

  const parcel1: parcel = {
    escalationlevel: 1,
  };
  useEffect(() => {
    axios.post("/api/qizztaker", parcel1).then((resp) => {
      setcategory_Array(resp.data);
    });
  }, []);

  async function GetData(escalationlevel: number, labelToChange?: String) {
    switch (escalationlevel) {
      case 1:
        axios.post("/api/qizztaker/v2", parcel1).then((resp) => {
          setcategory_Array(resp.data);
        });

      case 2:
        let parcel2: parcel = {
          escalationlevel: escalationlevel,
          category: labelToChange,
        };
        axios.post("/api/qizztaker/v2", parcel2).then((resp) => {
          console.log(resp.data);
          setsub_category_Array(resp.data);
        });

      case 3:
        let parcel3: parcel = {
          escalationlevel: escalationlevel,
          category: category?.name,
          subcategory: labelToChange,
          lat: userLocation.latitude,
          long: userLocation.longitude,
          radius: radius,
        };
        axios.post("/api/qizztaker/v2", parcel3).then((resp) => {
          console.log(resp.data);
          setsubmittedJob_Array(resp.data);
        });
    }
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
            setUserLocation({ latitude, longitude });
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
        {userLocation && (
          <div>
            <h2>User Location</h2>
            <p>Latitude: {userLocation.latitude} </p>
            <p>Longitude: {userLocation.longitude}</p>
            RADIUS
            {/* {radius} */}
            <input
              type='number'
              className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold text-xl py-10 px-10  my-5'
              id='radius'
              value={radius}
              onChange={(e) => setradius(Number(e.target.value))}
            />{" "}
          </div>
        )}

        {userLocation !== null && (
          <button
            className=' bg-blue-600  hover:bg-blue-900 ml-3  text-white center outline text-center font-bold py-2 px-4 rounded-full my-5'
            onClick={() => {
              setstage(1);
            }}
          >
            Proceed to next step
          </button>
        )}
      </div>
    );
  };

  function CategoryBOX() {
    return (
      <div>
        PICK A CATEGORY
        {category_Array?.length! > 0 && (
          <>
            {category_Array!.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  setcategory(category);
                  setstage(2);
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
        {sub_category_Array?.length! > 0 && (
          <>
            {sub_category_Array!.map((sub_category) => (
              <div
                key={sub_category.id}
                onClick={() => {
                  // setsub_category(sub_category);
                  setstage(3);
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

  function isJobVisible(job: any): Boolean {
    console.log(job);
    if (firstTobuy === true) {
      if (job.first_to_buy === false) {
        return false;
      }
    }
    if (pictureseRequired === true) {
      if (job.pictures.length === 0) {
        return false;
      }
    }
    if (
      hiringstageCriteria.includes(job.hiringstage!) &&
      timingCriteria.includes(job.timing!) &&
      minbudget <= job.minBudget! &&
      maxbudget >= job.maxBudget!
    ) {
      return true;
    }
    return false;
  }

  function JOBbox() {
    function toggleShow(jobid: String) {
      if (currentJobID !== jobid) {
        setcurrentJobID(jobid);
      }
      if (currentJobID === jobid) {
        setcurrentJobID("");
      }
    }

    return (
      <div className='ml-3 center outline text-center font-bold py-2 px-4  rounded-md my-5'>
        A LIST OF FRESH JOBS
        {submittedJob_Array?.length! > 0 && (
          <>
            {submittedJob_Array!.map(
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
                    <div>PICS LENGTH:{job.pictures.length}</div>
                    {job.extrainfo !== "undefined" && (
                      <div>EXTRA INFO: {job.extrainfo}</div>
                    )}

                    {currentJobID === job.id && (
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
          {firstTobuy === false && (
            <button
              onClick={() => {
                setfirstTobuy(true);
              }}
              className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              ENABLE FIRST TO BUY FILTER
            </button>
          )}
          {firstTobuy === true && (
            <button
              onClick={() => {
                setfirstTobuy(false);
              }}
              className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              DISABLE FIRST TO BUY FILTER
            </button>
          )}{" "}
          {pictureseRequired === false && (
            <button
              onClick={() => {
                setpictureseRequired(true);
              }}
              className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              ENABLE LEADS WITH IMAGES
            </button>
          )}
          {pictureseRequired === true && (
            <button
              onClick={() => {
                setpictureseRequired(false);
              }}
              className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              DISABLE LEADS WITH IMAGES
            </button>
          )}{" "}
        </div>
        <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'>
          <h1>TIMING</h1>{" "}
          {timingPRESETS.map((preset) => (
            <div key={preset.toString()}>
              {" "}
              {timingCriteria.includes(preset) === true && (
                <button
                  onClick={() => {
                    const newcriteria = timingCriteria.filter(
                      (preset1) => preset1 !== preset
                    );
                    settimingCriteria(newcriteria);
                  }}
                  className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                >
                  DISABLE {preset} CRITERIA
                </button>
              )}
              {timingCriteria.includes(preset) === false && (
                <button
                  onClick={() => {
                    const newcriteria = [...timingCriteria, preset];
                    settimingCriteria(newcriteria);
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
              {budgetPRESETS.map((preset) => (
                <div key={preset.toString()}>
                  {" "}
                  {minbudget === preset && (
                    <button
                      // onClick={() => {
                      //   setminbudget(preset);
                      // }}
                      className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                    >
                      Minimal budget is set to {preset}
                    </button>
                  )}
                  {minbudget !== preset && (
                    <button
                      onClick={() => {
                        setminbudget(preset);
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
              {budgetPRESETS.map((preset) => (
                <div key={preset.toString()}>
                  {" "}
                  {preset === maxbudget && (
                    <button
                      // onClick={() => {

                      // }}
                      className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
                    >
                      Maximum budget is set to {preset}{" "}
                    </button>
                  )}
                  {preset !== maxbudget && (
                    <button
                      onClick={() => {
                        setmaxbudget(preset);
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

  return (
    <div>
      {stage === 3 && (
        <div>
          <button
            className='ml-3 center bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
            onClick={() => {
              if (filterBoxEnabled === false) {
                setfilterBoxEnabled(true);
              } else {
                setfilterBoxEnabled(false);
              }
            }}
          >
            FILTERS
          </button>
          {filterBoxEnabled === true && <FilterBox />}
        </div>
      )}

      {stage === 0 && <Geolocatatrix />}
      {stage === 1 && <CategoryBOX />}
      {stage === 2 && <SubcategoryBOX />}
      {stage === 3 && <JOBbox />}
    </div>
  );
};

export default IQBrowser;
