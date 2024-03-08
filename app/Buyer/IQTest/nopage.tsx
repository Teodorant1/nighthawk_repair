"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { question, answer, category, sub_category } from "@prisma/client";
import { useSession } from "next-auth/react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useAppState } from "./iqtContext";
import { ClickedPosition, CloudinaryResult, parcel } from "@/projecttypes";

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
    clickPosition,
    setclickPosition,
  } = useAppState();
  const mapContainerStyle = {
    width: "100%",
    height: "700px",
  };

  const mapRef = useRef<GoogleMap | null>(null);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const clickedPosition: ClickedPosition = {
      lat: event.latLng!.lat(),
      lng: event.latLng!.lng(),
    };
    setclickPosition(clickedPosition);
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
  async function GetData(escalationlevel: number, labelToChange?: string) {
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
            lat: clickPosition?.lat,
            long: clickPosition?.lng,

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
            lat: clickPosition?.lat,
            long: clickPosition?.lng,

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
            lat: clickPosition?.lat,
            long: clickPosition?.lng,

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
            lat: clickPosition?.lat,
            long: clickPosition?.lng,

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
        <div className='flex items-center justify-center w-screen'>
          <div className=' center outline  bg-green-800 text-white   text-center font-bold m-3 py-4 px-12 rounded-full '>
            STEP 1. PICK A CATEGORY{" "}
          </div>{" "}
        </div>
        {category_Array?.length! > 0 && (
          <>
            {category_Array!.map((category) => (
              <div
                key={category.id}
                className='flex items-center justify-center w-screen'
              >
                <div
                  onClick={() => {
                    setcategory(category);
                    setstage(2);
                    GetData(2, category.name);
                  }}
                  className=' center outline     text-center font-bold  rounded-full  m-3 py-4 px-12'
                >
                  {category.name}
                </div>{" "}
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
        <div className='flex items-center justify-center w-screen'>
          <div className='m-3 py-4 px-12  center outline  bg-green-800 text-white   text-center font-bold  rounded-full '>
            STEP 2. PICK A SUBCATEGORY{" "}
          </div>{" "}
        </div>
        {sub_category_Array?.length! > 0 && (
          <>
            {sub_category_Array!.map((sub_category) => (
              <div
                key={sub_category.id}
                className='flex items-center justify-center w-screen'
              >
                <div
                  onClick={() => {
                    // setsub_category(sub_category);
                    setstage(3);
                    GetData(3, sub_category!.name);
                    GetData(3.5, sub_category!.name);
                  }}
                  className='m-3 py-4 px-12 center outline     text-center font-bold  rounded-full '
                >
                  {sub_category.name}
                </div>
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
        <div
          onClick={() => {
            setstage(3.4);
          }}
          className='m-3 py-4 px-12 center outline bg-green-800 text-white    text-center font-bold rounded-full '
        >
          {" "}
          Click here to proceed to the next step{" "}
        </div>
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
                        className=' center outline text-center font-bold m-3 py-4 px-12'
                      >
                        <div className='m-3 center outline bg-green-800 text-white    text-center font-bold py-4 px-12 rounded-full '>
                          {question.text_Question}?
                        </div>
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
        <div className='flex items-center justify-center w-screen'>
          <div className='m-3 py-4 px-12 center outline bg-green-800 text-white    text-center font-bold  rounded-full '>
            {" "}
            Questionare Stage
          </div>{" "}
          <div className='m-3 center outline   bg-green-800 text-white  text-center font-bold py-4 px-12 rounded-full '>
            {" "}
            You have answered {AnsweredQuestionsArray?.length!}/
            {Question_Array?.length!} questions{" "}
          </div>
        </div>
        {AnsweredQuestionsArray?.length! >= Question_Array?.length! && (
          <div className='flex items-center justify-center w-screen'>
            {" "}
            <div
              onClick={() => {
                setstage(3.4);
              }}
              className='m-3 center outline bg-green-800 text-white    text-center font-bold py-4 px-12 rounded-full '
            >
              {" "}
              Click here to proceed to the next step{" "}
            </div>
            {/* <OptionalQuestionBOX /> */}
          </div>
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
                        className='m-3 center   text-center font-bold py-4 px-12 rounded-sm '
                      >
                        <div className='flex items-center justify-center w-screen'>
                          <div className='m-3 center outline bg-green-800 text-white    text-center font-bold py-4 px-12 rounded-full '>
                            {" "}
                            {question.text_Question}?
                          </div>{" "}
                        </div>
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
                  {answers?.map((answer) => (
                    <div
                      key={answer.text_answer}
                      className='flex items-center justify-center w-screen'
                    >
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
                        className=' center outline bg-white text-center font-bold  rounded-full m-3 py-4 px-12'
                      >
                        {" "}
                        {answer.text_answer}{" "}
                      </div>{" "}
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
            <div className='m-3 center outline text-center font-bold py-4 px-12 rounded-full '>
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
      <div className='p-10 justify-center items-center'>
        {AnsweredQuestionsArray.length > 0 && (
          <>
            {AnsweredQuestionsArray.length >= Question_Array.length && (
              <>
                {" "}
                {coordsTouched === false && (
                  <>
                    {" "}
                    <GeolocationBox />
                    <div className='flex items-center justify-center w-screen'>
                      <div
                        onClick={() => {
                          setcoordsTouched(true);
                        }}
                        className='m-3 center bg-green-800 text-white   text-center font-bold py-4 px-12 rounded-full '
                      >
                        {" "}
                        Click here to finalize coordinates and go to the final
                        page{" "}
                      </div>
                    </div>
                  </>
                )}
                {coordsTouched && (
                  <div>
                    {" "}
                    {status === "authenticated" && (
                      <>
                        {" "}
                        <div className='flex justify-center items-center'>
                          <input
                            type='text'
                            className=' w-[80%] h-[15%]  outline text-center font-bold py-10 px-10  '
                            id='ExtraDetails'
                            placeholder='Extra details go here'
                          />{" "}
                        </div>{" "}
                        <div className='flex items-center justify-center w-screen'>
                          <button
                            onClick={() => {
                              GetData(5);
                            }}
                            className=' bg-green-800 text-white m-3 center  text-center font-bold py-4 px-12 rounded-full '
                          >
                            CLICK HERE TO SUBMIT{" "}
                          </button>{" "}
                        </div>
                      </>
                    )}
                    {status === "unauthenticated" && (
                      <div className='px-[40%]'>
                        {/* <div className='bg-blue-900  m-3  text-white center outline text-center font-bold py-4 px-12 rounded-full '> */}
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
                            className='outline text-center font-bold py-4 px-12 rounded-full '
                            id='email'
                            placeholder='email goes here'
                          />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          Password
                          <input
                            type='text'
                            className='outline text-center font-bold py-4 px-12 rounded-full '
                            id='password'
                            placeholder='password goes here'
                          />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          Phone Number
                          <input
                            type='text'
                            className='outline text-center font-bold py-4 px-12 rounded-full '
                            id='phoneNum'
                            placeholder='phoneNum goes here'
                          />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          Name
                          <input
                            type='text'
                            className='outline text-center font-bold py-4 px-12 rounded-full '
                            id='name'
                            placeholder='name goes here'
                          />{" "}
                        </div>
                        <div>
                          {" "}
                          Extra Details
                          <input
                            type='text'
                            className='mx-[20%] w-[50%] h-[10%] outline text-center font-bold py-10 px-10  '
                            id='ExtraDetails'
                            placeholder='Extra details go here'
                          />{" "}
                        </div>
                        <div
                          onClick={() => {
                            GetData(6, "EXISTINGACCOUNT");
                          }}
                          className=' bg-blue-600  hover:bg-blue-900 m-3  text-white center outline text-center font-bold py-4 px-12 rounded-full '
                        >
                          CLICK HERE TO SUBMIT WITH YOUR EXISTING ACCOUNT{" "}
                        </div>{" "}
                        <div
                          onClick={() => {
                            GetData(6, "CREATEACCOUNT");
                          }}
                          className=' bg-blue-600  hover:bg-blue-900 m-3  text-white center outline text-center font-bold py-4 px-12 rounded-full '
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

    return (
      <div className='flex items-center justify-center w-screen'>
        <button
          onClick={() => {
            setstage(4);
            setpictures(pictures2);
          }}
          className='m-3 center outline bg-green-800 text-white    text-center font-bold py-4 px-12 rounded-full '
        >
          {" "}
          Click here to move to the next step{" "}
        </button>{" "}
        <button className='m-3 center bg-green-800 text-white  text-center font-bold py-4 px-12 rounded-full '>
          {" "}
          You have uploaded {pictures2.length} pictures so far.
        </button>
        <CldUploadWidget
          uploadPreset='wn6nts4f'
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
              className='m-3 center bg-blue-800 text-white  text-center font-bold py-4 px-12 rounded-full '
            >
              Click here to upload
            </button>
          )}
        </CldUploadWidget>{" "}
        <>
          {" "}
          {pictures2.length > 0 && (
            <div className=' p-5 flex flex-wrap'>
              {pictures2.map((id) => (
                <div
                  className='p-5 m-3'
                  key={id}
                >
                  {" "}
                  <CldImage
                    src={id}
                    width={300}
                    height={200}
                    alt={id}
                  />{" "}
                </div>
              ))}
            </div>
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
          center={clickPosition!}
          zoom={2}
          onClick={handleMapClick}
          onLoad={(map: any) => {
            mapRef.current = map;
          }}
        >
          {clickPosition && (
            <Marker
              position={{ lat: clickPosition.lat, lng: clickPosition.lng }}
            />
          )}
        </GoogleMap>
        {/* {clickPosition && (
          <div>
            <h3>Clicked Coordinates:</h3>
            <p>Latitude: {clickPosition.lat.toFixed(6)}</p>
            <p>Longitude: {clickPosition.lng.toFixed(6)}</p>
          </div>
        )} */}
      </LoadScript>
    );
  }

  function SuccessBox() {
    return (
      <div className='m-3 center bg-green-800 text-white text-center font-bold py-20 px-12 rounded-full '>
        {" "}
        CONGRATULATIONS! YOU HAVE UPLOADED THE JOB , CHECK YOUR EMAIL FOR OUR
        AUTOMATED CONFIRMATION EMAIL
      </div>
    );
  }

  function ExtraDetailsBox() {
    function uploadState() {
      setstage(3.5);
    }

    return (
      <div className='flex flex-wrap'>
        {/* <div className='flex flex-wrap  justify-center items-center '>
          {" "}
          <input
            type='text'
            className='mx-20 my-10  h-[10%] outline text-center font-bold text-xl py-10 px-10  '
            id='title2'
            placeholder=""
            defaultValue={title1}
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
        </div>{" "} */}
        <div>
          {" "}
          {first_to_buy === true && (
            <div className='flex items-center justify-center '>
              <button
                onClick={() => {
                  setfirst_to_buy(false);
                }}
                className='m-3 center bg-red-600 text-white text-center font-bold py-4 px-12 rounded-full '
              >
                Click here to disable first to buy
              </button>{" "}
            </div>
          )}
        </div>
        <div>
          {" "}
          {first_to_buy === false && (
            <div className='flex items-center justify-center '>
              <button
                onClick={() => {
                  setfirst_to_buy(true);
                }}
                className='m-3 center outline bg-green-800 text-white    text-center font-bold py-4 px-12 rounded-full '
              >
                Click here to enable first to buy
              </button>{" "}
            </div>
          )}
        </div>{" "}
        <div>
          <div className='flex items-center justify-center '>
            <div className='m-3 center bg-green-800 text-white    text-center font-bold py-4 px-12 rounded-full '>
              Timing : {timing}
            </div>
          </div>
          {timingPRESETS!.map((preset) => (
            <>
              {" "}
              {timing === preset && (
                <div
                  key={preset.toString()}
                  className='flex items-center justify-center '
                >
                  <div
                    onClick={() => {
                      settiming(preset.toString());
                    }}
                    className=' bg-green-600 text-white   m-3 center outline text-center font-bold py-4 px-12 rounded-full  '
                  >
                    {preset}
                  </div>{" "}
                </div>
              )}
              {timing !== preset && (
                <div
                  key={preset.toString()}
                  className='flex items-center justify-center '
                >
                  <div
                    onClick={() => {
                      settiming(preset.toString());
                    }}
                    className='    m-3 center outline text-center font-bold py-4 px-12 rounded-full  '
                  >
                    {preset}
                  </div>{" "}
                </div>
              )}
            </>
          ))}
        </div>
        <div>
          <div className='flex items-center justify-center '>
            <div className='m-3 center bg-green-800 text-white    text-center font-bold py-4 px-12 rounded-full '>
              Hiring Stage : {hiringstage}
            </div>{" "}
          </div>
          {hiringstagePRESETS!.map((preset) => (
            <>
              {hiringstage === preset && (
                <div
                  key={preset.toString()}
                  className='flex items-center justify-center '
                >
                  <div
                    onClick={() => {
                      sethiringstage(preset.toString());
                    }}
                    className='bg-green-600 text-white   m-3 center outline text-center font-bold py-4 px-12 rounded-full  '
                  >
                    {preset}
                  </div>{" "}
                </div>
              )}{" "}
              {hiringstage !== preset && (
                <div
                  key={preset.toString()}
                  className='flex items-center justify-center '
                >
                  <div
                    onClick={() => {
                      sethiringstage(preset.toString());
                    }}
                    className='   m-3 center outline text-center font-bold py-4 px-12 rounded-full  '
                  >
                    {preset}
                  </div>{" "}
                </div>
              )}
            </>
          ))}
        </div>
        <div>
          <div className='flex items-center justify-center '>
            <div className='m-3 center bg-green-800 text-white    text-center font-bold py-4 px-12 rounded-full '>
              Minimum Budget : {minbudget}
            </div>{" "}
          </div>
          {minbudgetPRESETS!.map((preset) => (
            <>
              {minbudget === preset && (
                <div
                  key={preset.toString()}
                  className='flex items-center justify-center '
                >
                  <div
                    onClick={() => {
                      setminbudget(preset);
                    }}
                    className='  bg-green-600 text-white   m-3 center outline text-center font-bold py-4 px-12 rounded-full  '
                  >
                    {preset}
                  </div>{" "}
                </div>
              )}{" "}
              {minbudget !== preset && (
                <div
                  key={preset.toString()}
                  className='flex items-center justify-center '
                >
                  <div
                    onClick={() => {
                      setminbudget(preset);
                    }}
                    className='   m-3 center outline text-center font-bold py-4 px-12 rounded-full  '
                  >
                    {preset}
                  </div>{" "}
                </div>
              )}
            </>
          ))}
        </div>{" "}
        <div>
          <div className='flex items-center justify-center '>
            <div className='m-3 center bg-green-800 text-white   text-center font-bold py-4 px-12 rounded-full '>
              Current Maximum Budget : {maxbudget}
            </div>{" "}
          </div>
          {maxbudgetPRESETS!.map((preset) => (
            <>
              {maxbudget === preset && (
                <div
                  key={preset.toString()}
                  className='flex items-center justify-center '
                >
                  <div
                    onClick={() => {
                      setmaxbudget(preset);
                    }}
                    className=' bg-green-600 text-white  m-3 center outline text-center font-bold py-4 px-12 rounded-full  '
                  >
                    {preset}
                  </div>{" "}
                </div>
              )}{" "}
              {maxbudget !== preset && (
                <div
                  key={preset.toString()}
                  className='flex items-center justify-center '
                >
                  <div
                    onClick={() => {
                      setmaxbudget(preset);
                    }}
                    className='   m-3 center outline text-center font-bold py-4 px-12 rounded-full  '
                  >
                    {preset}
                  </div>{" "}
                </div>
              )}
            </>
          ))}
        </div>
        <div>
          {" "}
          <div className='flex items-center justify-center '>
            <div
              onClick={() => {
                uploadState();
              }}
              className='m-3 center  bg-red-800 text-white    text-center font-bold py-4 px-12 rounded-full '
            >
              {" "}
              Click here to move to the next step{" "}
            </div>{" "}
          </div>
        </div>
      </div>
    );
  }

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
