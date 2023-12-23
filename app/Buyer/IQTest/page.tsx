"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { question, answer, category, sub_category } from "@prisma/client";
import { useSession } from "next-auth/react";

const QIZZTAKER = () => {
  const [userLocation, setUserLocation] = useState<any>(null);
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
  const [AnsweredQuestionsArray2, setAnsweredQuestionsArray2] = useState<
    answer[]
  >([]);

  // interface question1 {
  //   id: String;
  //   text_Question: String;
  //   sub_categoryID: String;
  //   categoryID: String;
  // }
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
    password?: String;
    name?: String;
    phonenum?: String;
    isOptional?: boolean;
  }

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
            lat: userLocation.latitude,
            long: userLocation.longitude,
          };
          axios.post("/api/qizztaker", parcel4).then((resp) => {
            setstage(4);
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
            lat: userLocation.latitude,
            long: userLocation.longitude,
          };
          axios.post("/api/qizztaker", parcel4).then((resp) => {
            setstage(4);
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
            lat: userLocation.latitude,
            long: userLocation.longitude,
          };
          axios.post("/api/qizztaker", parcel4).then((resp) => {
            setstage(4);
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
            lat: userLocation.latitude,
            long: userLocation.longitude,
          };
          axios.post("/api/qizztaker", parcel4).then((resp) => {
            setstage(4);
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
        <div className='bg-green-500'>
          {" "}
          {optQuestion_Array!.length > 0 && (
            <>
              {optQuestion_Array!.map((question) => (
                <>
                  <div>
                    <>
                      {AnsweredQuestionsArray.includes(question.id) ===
                        false && (
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
                <GeolocationBox />
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
                      You are not LOGGED IN , so you can either click to submit
                      with your existing credentials OR submit and REGISTER at
                      the same time
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
                )}
              </>
            )}
          </>
        )}
      </div>
    );
  }

  function GeolocationBox() {
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
      <div className='bg-blue-900  ml-3  text-white center outline text-center font-bold py-2 px-4 rounded-full my-5'>
        <h1>
          You can submit your location to make it easier for potential
          professionals to filter for it
        </h1>
        <h2>(Make sure to allow our app to know your location)</h2>
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
            <h2>Your Location</h2>
            <p>Latitude: {userLocation.latitude} </p>
            <p>Longitude: {userLocation.longitude}</p>
          </div>
        )}
      </div>
    );
  }

  function SuccessBox() {
    return (
      <> YOU HAVE UPLOADED THE JOB , CHECK YOUR EMAIL FOR CONFIRMATION EMAIL</>
    );
  }

  return (
    <div>
      {/* stage: {stage} */}
      {stage === 3 && <SubmitBox />}
      {stage === 4 && <SuccessBox />}
      {stage === 1 && <CategoryBOX />}
      {stage === 2 && <SubcategoryBOX />}
      {stage === 3 && <QuestionBOX />}
    </div>
  );
};

export default QIZZTAKER;
