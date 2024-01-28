"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { question, answer, category, sub_category } from "@prisma/client";
import { useSession } from "next-auth/react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useAppState } from "./iqtContext";
import { parcel } from "@/projecttypes";

const QIZZTAKER = () => {
  // const [userLocationText, setUserLocationText] = useState<String>(
  //   "Testing the alt tab error"
  // );

  const {
    title1,
    settitle1,
    timing,
    settiming,
    hiringstage,
    sethiringstage,
    first_to_buy,
    setfirst_to_buy,
    minbudget,
    setminbudget,
    maxbudget,
    setmaxbudget,
    extradetailsText,
    setextradetailsText,
    pictures,
    setpictures,
  } = useAppState();
  const mapContainerStyle = {
    width: "100%",
    height: "700px",
  };
  interface ClickedPosition {
    lat: number;
    lng: number;
  }
  const center = {
    lat: 0,
    lng: 0,
  };

  const [clickedPosition, setClickedPosition] =
    useState<ClickedPosition | null>({ lat: 0, lng: 0 });

  const mapRef = useRef<GoogleMap | null>(null);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const clickedPosition: ClickedPosition = {
      lat: event.latLng!.lat(),
      lng: event.latLng!.lng(),
    };
    setClickedPosition(clickedPosition);
  };
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
  const [minbudgetPRESETS, setminbudgetPRESETS] = useState<number[]>([
    0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000,
  ]);
  const [maxbudgetPRESETS, setmaxbudgetPRESETS] = useState<number[]>([
    0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000,
  ]);

  // const [timing, settiming1] = useState<String>("URGENTLY");
  // const [hiringstage, sethiringstage1] = useState<String>("Insurance Quote");
  // const [first_to_buy, setfirst_to_buy1] = useState<boolean>(false);
  // const [minbudget, setminbudget1] = useState<number>(0);
  // const [maxbudget, setmaxbudget1] = useState<number>(0);
  // const [pictures, setpictures] = useState<String[]>([]);

  // const [userLocation, setUserLocation] = useState<any>(null);
  // const [longitude, setLongitude] = useState<number>(0);
  // const [latitude, setLatitude] = useState<number>(0);
  const [coordsTouched, setcoordsTouched] = useState<boolean>(false);

  const { status, data: session } = useSession();
  const [stage, setstage] = useState<number>(1);
  const [category, setcategory] = useState<category>();
  const [category_Array, setcategory_Array] = useState<category[]>();
  // const [sub_category, setsub_category] = useState<sub_category>();
  const [sub_category_Array, setsub_category_Array] =
    useState<sub_category[]>();
  const [Question_Array, setQuestion_Array] = useState<question[]>([]);
  const [optQuestion_Array, setoptQuestion_Array] = useState<question[]>([]);
  //odgovorena pitanja
  const [AnsweredQuestionsArray, setAnsweredQuestionsArray] = useState<
    String[]
  >([]);
  const [AnsweredQuestionsArray1, setAnsweredQuestionsArray1] = useState<
    answer[]
  >([]);

  const parcel1: parcel = {
    escalationlevel: 1,
  };
  useEffect(() => {
    axios.post("/api/qizztaker", parcel1).then((resp) => {
      setcategory_Array(resp.data);
    });
  }, []);

  // useEffect(() => {
  //   let parcel2: parcel = { escalationlevel: 2, category: category!.name };
  //   axios.post("/api/qizztaker", parcel2).then((resp) => {
  //     setsub_category_Array(resp.data);
  //   });
  // }, [category]);
  async function GetData(escalationlevel: number, labelToChange?: String) {
    switch (escalationlevel) {
      case 1:
        axios.post("/api/qizztaker", parcel1).then((resp) => {
          setcategory_Array(resp.data);
        });
        break;

      case 2:
        let parcel2: parcel = {
          escalationlevel: escalationlevel,
          category: labelToChange,
        };
        axios.post("/api/qizztaker", parcel2).then((resp) => {
          console.log(resp.data);
          setsub_category_Array(resp.data);
        });
        break;

      case 3:
        let parcel3: parcel = {
          escalationlevel: escalationlevel,
          category: category?.name,
          subcategory: labelToChange,
          isOptional: false,
        };
        axios.post("/api/qizztaker", parcel3).then((resp) => {
          console.log(resp.data);
          setQuestion_Array(resp.data);
        });
        break;
      case 3.5:
        let parcel35: parcel = {
          escalationlevel: escalationlevel,
          category: category?.name,
          subcategory: labelToChange,
          isOptional: true,
        };
        axios.post("/api/qizztaker", parcel35).then((resp) => {
          setoptQuestion_Array(resp.data);
          // console.log(resp.data);
          // console.log(resp.data.length);
          // setQuestion_Array(resp.data);
        });
        break;

      // case 4 is in answerbox
      case 5:
        const extrainfo = (
          document.getElementById("ExtraDetails") as HTMLInputElement
        )?.value;
        if (extrainfo) {
          let parcel4: parcel = {
            escalationlevel: escalationlevel,
            category: AnsweredQuestionsArray1.at(0)?.categoryID,
            subcategory: AnsweredQuestionsArray1.at(0)?.sub_categoryID,
            answeredquestions: AnsweredQuestionsArray1,
            extrainfo: extrainfo,
            method: "createjobpost",
            email: session?.user.email,
            lat: clickedPosition?.lat,
            long: clickedPosition?.lng,

            title: title1,
            timing: timing,
            hiringstage: hiringstage,
            firstToBuy: first_to_buy,
            minbudget: minbudget,
            maxbudget: maxbudget,
            pictures: pictures,
          };
          axios.post("/api/qizztaker", parcel4).then((resp) => {
            setstage(5);
          });
          break;
        } else {
          let parcel4: parcel = {
            escalationlevel: escalationlevel,
            category: AnsweredQuestionsArray1.at(0)?.categoryID,
            subcategory: AnsweredQuestionsArray1.at(0)?.sub_categoryID,
            answeredquestions: AnsweredQuestionsArray1,
            method: "createjobpost",
            email: session?.user.email,
            lat: clickedPosition?.lat,
            long: clickedPosition?.lng,

            title: title1,
            timing: timing,
            hiringstage: hiringstage,
            firstToBuy: first_to_buy,
            minbudget: minbudget,
            maxbudget: maxbudget,
            pictures: pictures,
          };
          axios.post("/api/qizztaker", parcel4).then((resp) => {
            setstage(5);
          });
          break;
        }

      case 6:
        // submitting and registering
        const extrainfo1 = (
          document.getElementById("ExtraDetails") as HTMLInputElement
        )?.value;

        const email = (document.getElementById("email") as HTMLInputElement)
          ?.value;
        const password = (
          document.getElementById("password") as HTMLInputElement
        )?.value;
        const phoneNum = (
          document.getElementById("phoneNum") as HTMLInputElement
        )?.value;
        const name = (document.getElementById("name") as HTMLInputElement)
          ?.value;

        if (extrainfo1) {
          let parcel4: parcel = {
            escalationlevel: escalationlevel,
            category: AnsweredQuestionsArray1.at(0)?.categoryID,
            subcategory: AnsweredQuestionsArray1.at(0)?.sub_categoryID,
            answeredquestions: AnsweredQuestionsArray1,
            extrainfo: extrainfo1,
            method: labelToChange,
            email: email,
            password: password,
            phonenum: phoneNum,
            name: name,
            lat: clickedPosition?.lat,
            long: clickedPosition?.lng,

            title: title1,
            timing: timing,
            hiringstage: hiringstage,
            firstToBuy: first_to_buy,
            minbudget: minbudget,
            maxbudget: maxbudget,
            pictures: pictures,
          };
          axios.post("/api/qizztaker", parcel4).then((resp) => {
            setstage(5);
          });
          break;
        } else {
          let parcel4: parcel = {
            escalationlevel: escalationlevel,
            category: AnsweredQuestionsArray1.at(0)?.categoryID,
            subcategory: AnsweredQuestionsArray1.at(0)?.sub_categoryID,
            answeredquestions: AnsweredQuestionsArray1,
            method: labelToChange,
            email: email,
            lat: clickedPosition?.lat,
            long: clickedPosition?.lng,

            title: title1,
            timing: timing,
            hiringstage: hiringstage,
            firstToBuy: first_to_buy,
            minbudget: minbudget,
            maxbudget: maxbudget,
            pictures: pictures,
          };
          axios.post("/api/qizztaker", parcel4).then((resp) => {
            setstage(5);
          });
          break;
        }
    }
  }

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
                className='ml-3 center outline text-center font-bold py-2 px-4 rounded-full my-5 '
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
                  GetData(3.5, sub_category!.name);
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

  function OptionalQuestionBOX() {
    return (
      <div className='bg-green-500'>
        {" "}
        <button
          onClick={() => {
            setstage(3.4);
          }}
          className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
        >
          {" "}
          Click here to proceed to the next step{" "}
        </button>
        {optQuestion_Array!.length === 0 && (
          <>
            This questionare has no optional questions, so you can just proceed
            to the next stage safely
          </>
        )}
        {optQuestion_Array!.length > 0 && (
          <>
            {optQuestion_Array!.map((question) => (
              <>
                <div>
                  <>
                    {AnsweredQuestionsArray.includes(question.id) === false && (
                      <div
                        key={question.id}
                        className='ml-3 center outline text-center font-bold py-2 px-4  my-5'
                      >
                        <div> {question.text_Question}?</div>
                        <div>
                          {" "}
                          <AnswerBOX
                            id={question.id}
                            text_Question={question.text_Question}
                            sub_categoryID={question.sub_categoryID}
                            categoryID={question.categoryID}
                            answers={null}
                            isOptional={question.isOptional}
                            // index1={index}
                          />
                        </div>{" "}
                      </div>
                    )}
                  </>
                </div>
              </>
            ))}
          </>
        )}
      </div>
    );
  }
  function QuestionBOX() {
    return (
      <div>
        <div> Questionare Stage</div>
        {true && (
          <>
            {" "}
            <div>
              {" "}
              You have answered {AnsweredQuestionsArray?.length!}/
              {Question_Array?.length!} questions{" "}
            </div>
          </>
        )}
        {AnsweredQuestionsArray?.length! >= Question_Array?.length! && (
          <>
            {" "}
            <button
              onClick={() => {
                setstage(3.4);
              }}
              className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              {" "}
              Click here to proceed to the next step{" "}
            </button>
            {/* <OptionalQuestionBOX /> */}
          </>
        )}
        {Question_Array!.length > 0 && (
          <>
            {Question_Array!.map((question) => (
              <>
                <div>
                  <>
                    {AnsweredQuestionsArray.includes(question.id) === false && (
                      <div
                        key={question.id}
                        className='ml-3 center outline text-center font-bold py-2 px-4  my-5'
                      >
                        <div> {question.text_Question}?</div>
                        <div>
                          {" "}
                          <AnswerBOX
                            id={question.id}
                            text_Question={question.text_Question}
                            sub_categoryID={question.sub_categoryID}
                            categoryID={question.categoryID}
                            answers={null}
                            isOptional={question.isOptional}
                            // index1={index}
                          />
                        </div>{" "}
                      </div>
                    )}
                  </>
                </div>
              </>
            ))}
          </>
        )}{" "}
      </div>
    );
  }
  function AnswerBOX(question: question) {
    const [IsClicked, SetIsClicked] = useState<boolean>(false);
    const [answers, setanswers] = useState<answer[]>();
    // const [pickedanswer, setpickedanswer] = useState<answer>();
    const parcel5: parcel = {
      escalationlevel: 4,
      category: question.categoryID,
      subcategory: question.sub_categoryID,
      question: question.text_Question,
    };
    useEffect(() => {
      axios.post("/api/qizztaker", parcel5).then((resp) => {
        setanswers(resp.data);
      });
    }, []);

    return (
      <div>
        {AnsweredQuestionsArray.includes(question.id) === false && (
          <>
            {" "}
            <div>
              {answers?.length! > 0 && (
                <>
                  {" "}
                  <div> Pick an answer from one of the following</div>
                  {answers?.map((answer) => (
                    <div
                      onClick={() => {
                        setAnsweredQuestionsArray((current) => [
                          ...current,
                          question.id,
                        ]);
                        setAnsweredQuestionsArray1((current) => [
                          ...current,
                          answer,
                        ]);
                      }}
                      key={answer.text_answer}
                      className='ml-3 center outline text-center font-bold py-2 px-4 rounded-full my-5'
                    >
                      {" "}
                      {answer.text_answer}{" "}
                    </div>
                  ))}
                </>
              )}{" "}
            </div>
          </>
        )}{" "}
        {IsClicked === true && (
          <>
            {" "}
            <div className='ml-3 center outline text-center font-bold py-2 px-4 rounded-full my-5'>
              {" "}
              You have already answered this question{" "}
            </div>
          </>
        )}
      </div>
    );
  }

  function SubmitBox() {
    return (
      <div>
        {AnsweredQuestionsArray.length > 0 && (
          <>
            {AnsweredQuestionsArray.length >= Question_Array.length && (
              <>
                {" "}
                {coordsTouched === false && (
                  <>
                    {" "}
                    <GeolocationBox />
                    <button
                      onClick={() => {
                        setcoordsTouched(true);
                      }}
                      className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
                    >
                      {" "}
                      Click here to finalize coordinates and go to the final
                      page{" "}
                    </button>
                  </>
                )}
                {coordsTouched && (
                  <div>
                    {" "}
                    {status === "authenticated" && (
                      <>
                        <input
                          type='text'
                          className='mx-[20%] w-[50%] h-[10%]  outline text-center font-bold py-10 px-10  my-5'
                          id='ExtraDetails'
                          placeholder='Extra details go here'
                        />{" "}
                        <div
                          onClick={() => {
                            GetData(5);
                          }}
                          className=' bg-blue-600  hover:bg-blue-900 ml-3  text-white center outline text-center font-bold py-2 px-4 rounded-full my-5'
                        >
                          CLICK HERE TO SUBMIT{" "}
                        </div>
                      </>
                    )}
                    {status === "unauthenticated" && (
                      <div className='px-[40%]'>
                        {/* <div className='bg-blue-900  ml-3  text-white center outline text-center font-bold py-2 px-4 rounded-full my-5'> */}
                        <div>
                          You are not LOGGED IN , so you can either click to
                          submit with your existing credentials OR submit and
                          REGISTER at the same time
                        </div>{" "}
                        <div>
                          {" "}
                          Email
                          <input
                            type='text'
                            className='outline text-center font-bold py-2 px-4 rounded-full my-5'
                            id='email'
                            placeholder='email goes here'
                          />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          Password
                          <input
                            type='text'
                            className='outline text-center font-bold py-2 px-4 rounded-full my-5'
                            id='password'
                            placeholder='password goes here'
                          />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          Phone Number
                          <input
                            type='text'
                            className='outline text-center font-bold py-2 px-4 rounded-full my-5'
                            id='phoneNum'
                            placeholder='phoneNum goes here'
                          />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          Name
                          <input
                            type='text'
                            className='outline text-center font-bold py-2 px-4 rounded-full my-5'
                            id='name'
                            placeholder='name goes here'
                          />{" "}
                        </div>
                        <div>
                          {" "}
                          Extra Details
                          <input
                            type='text'
                            className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold py-10 px-10  my-5'
                            id='ExtraDetails'
                            placeholder='Extra details go here'
                          />{" "}
                        </div>
                        <div
                          onClick={() => {
                            GetData(6, "EXISTINGACCOUNT");
                          }}
                          className=' bg-blue-600  hover:bg-blue-900 ml-3  text-white center outline text-center font-bold py-2 px-4 rounded-full my-5'
                        >
                          CLICK HERE TO SUBMIT WITH YOUR EXISTING ACCOUNT{" "}
                        </div>{" "}
                        <div
                          onClick={() => {
                            GetData(6, "CREATEACCOUNT");
                          }}
                          className=' bg-blue-600  hover:bg-blue-900 ml-3  text-white center outline text-center font-bold py-2 px-4 rounded-full my-5'
                        >
                          CLICK HERE TO SUBMIT AND CREATE ACCOUNT{" "}
                        </div>
                      </div>
                    )}{" "}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    );
  }

  function UploadBox() {
    console.log("rendering uploadBox");

    const [pictures2, setpictures2] = useState<string[]>([]);

    // useEffect(() => {
    //   if (pictures2.length > 0) {
    //     const newpictures = [...pictures, ...pictures2];
    //     setpictures(newpictures);
    //   }
    // }, [pictures2]);

    interface CloudinaryResult {
      public_id: String;
    }

    return (
      <div>
        <button
          onClick={() => {
            setstage(4);
            setpictures(pictures2);
          }}
          className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
        >
          {" "}
          Click here to move to the next step{" "}
        </button>{" "}
        <button className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'>
          {" "}
          You have uploaded {pictures2.length} pictures so far.
        </button>
        <CldUploadWidget
          uploadPreset='bqhf0bxn'
          onUpload={(result, widget) => {
            if (result.event !== "success") {
              return;
            }
            const info = result.info as CloudinaryResult;
            const pictures21 = [...pictures2, String(info.public_id)];
            setpictures2(pictures21);
          }}
        >
          {({ open }) => (
            <button
              onClick={() => open()}
              className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
            >
              Upload
            </button>
          )}
        </CldUploadWidget>{" "}
        <>
          {" "}
          {pictures2.length > 0 && (
            <>
              {pictures2.map((id) => (
                <div key={id.toString()}>
                  {" "}
                  <CldImage
                    src={id.toString()}
                    width={300}
                    height={200}
                    alt={id.toString()}
                  />{" "}
                </div>
              ))}
            </>
          )}{" "}
        </>
      </div>
    );
  }

  function GeolocationBox() {
    return (
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={clickedPosition!}
          zoom={2}
          onClick={handleMapClick}
          onLoad={(map: any) => {
            mapRef.current = map;
          }}
        >
          {clickedPosition && (
            <Marker
              position={{ lat: clickedPosition.lat, lng: clickedPosition.lng }}
            />
          )}
        </GoogleMap>
        {clickedPosition && (
          <div>
            <h3>Clicked Coordinates:</h3>
            <p>Latitude: {clickedPosition.lat.toFixed(6)}</p>
            <p>Longitude: {clickedPosition.lng.toFixed(6)}</p>
          </div>
        )}
      </LoadScript>
    );
  }

  function SuccessBox() {
    return (
      <> YOU HAVE UPLOADED THE JOB , CHECK YOUR EMAIL FOR CONFIRMATION EMAIL</>
    );
  }

  function ExtraDetailsBox() {
    const [title2, settitle2] = useState<String>("Title goes here");
    //  const [timing, settiming] = useState<String>("0");
    //  const [hiringstage, sethiringstage] = useState<String>("0");
    //  const [first_to_buy, setfirst_to_buy] = useState<boolean>(false);
    //  const [minbudget, setminbudget] = useState<number>(0);
    //  const [maxbudget, setmaxbudget] = useState<number>(0);
    //  const [extradetailsText, setextradetailsText] = useState<String>(
    //    "extra details goes here"
    //  );

    function uploadState() {
      setstage(3.5);
    }

    return (
      <div>
        EXTRA DETAILS{" "}
        <div>
          {" "}
          <div>TITLE: {title1}</div>
          <input
            type='text'
            className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold text-xl py-10 px-10  my-5'
            id='title2'
            defaultValue={title1.toString()}
            onBlur={(e) => {
              settitle1(e.target.value);
            }}
            onMouseMove={(e) => {
              const thetitle = (
                document.getElementById("title2") as HTMLInputElement
              )?.value;
              settitle1(thetitle);
            }}
          />{" "}
        </div>{" "}
        {/* <button
          className='ml-3 center bg-pink-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
          onClick={() => {
            const thetitle = (
              document.getElementById("title2") as HTMLInputElement
            )?.value;
            settitle1(thetitle);
          }}
        >
          {" "}
          Save title{" "}
        </button> */}
        {first_to_buy === true && (
          <button
            onClick={() => {
              setfirst_to_buy(false);
            }}
            className='ml-3 center bg-red-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
          >
            Click here to disable first to buy
          </button>
        )}
        {first_to_buy === false && (
          <button
            onClick={() => {
              setfirst_to_buy(true);
            }}
            className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'
          >
            Click here to enable first to buy
          </button>
        )}
        <div>
          <div className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'>
            Current timing value: {timing}
          </div>
          {timingPRESETS!.map((preset) => (
            <div
              key={preset.toString()}
              onClick={() => {
                settiming(preset.toString());
              }}
              className='ml-3 center outline text-center font-bold py-2 px-4 rounded-full my-5 '
            >
              {preset}
            </div>
          ))}
        </div>
        <div>
          <div className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'>
            Current hiringstage value: {hiringstage}
          </div>
          {hiringstagePRESETS!.map((preset) => (
            <div
              key={preset.toString()}
              onClick={() => {
                sethiringstage(preset.toString());
              }}
              className='ml-3 center outline text-center font-bold py-2 px-4 rounded-full my-5 '
            >
              {preset}
            </div>
          ))}
        </div>
        <div>
          <div className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'>
            Current minbudget value: {minbudget}
          </div>
          {minbudgetPRESETS!.map((preset) => (
            <div
              key={preset.toString()}
              onClick={() => {
                setminbudget(preset);
              }}
              className='ml-3 center outline text-center font-bold py-2 px-4 rounded-full my-5 '
            >
              {preset}
            </div>
          ))}
        </div>{" "}
        <div>
          <div className='ml-3 center bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full my-5'>
            Current maxbudget value: {maxbudget}
          </div>
          {maxbudgetPRESETS!.map((preset) => (
            <div
              key={preset.toString()}
              onClick={() => {
                setmaxbudget(preset);
              }}
              className='ml-3 center outline text-center font-bold py-2 px-4 rounded-full my-5 '
            >
              {preset}
            </div>
          ))}
        </div>
        <div>
          {" "}
          <button
            onClick={() => {
              uploadState();
            }}
            className='ml-3 center  bg-blue-950  text-white text-center font-bold py-2 px-4 rounded-full my-5'
          >
            {" "}
            Click here to move to the next step{" "}
          </button>{" "}
        </div>
      </div>
    );
  }
  // useEffect(() => {
  //   console.log("stage changed", stage);
  // }, [stage]);

  return (
    <div>
      {stage === 1 && <CategoryBOX />}
      {stage === 2 && <SubcategoryBOX />}
      {stage === 3 && <QuestionBOX />}
      {stage === 3.4 && <ExtraDetailsBox />}
      {stage === 3.5 && <UploadBox />}
      {stage === 4 && <SubmitBox />}
      {stage === 5 && <SuccessBox />}
    </div>
  );
};

export default QIZZTAKER;
