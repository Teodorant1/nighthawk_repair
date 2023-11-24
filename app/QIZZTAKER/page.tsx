"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { question, answer, category, sub_category } from "@prisma/client";
import { useParams } from "next/navigation";

const QIZZTAKER = () => {
  const [stage, setstage] = useState<number>(1);
  const [category, setcategory] = useState<category>();
  const [category_Array, setcategory_Array] = useState<category[]>();
  // const [sub_category, setsub_category] = useState<sub_category>();
  const [sub_category_Array, setsub_category_Array] =
    useState<sub_category[]>();
  const [Question_Array, setQuestion_Array] = useState<question[]>([]);
  //odgovorena pitanja
  const [Answer_Array, setanswer_Array] = useState<answer[]>([]);
  const [AnsweredQuestionsArray, setAnsweredQuestionsArray] = useState<
    String[]
  >([]);
  // const [AnswerIndex_Array, setanswerIndex_Array] = useState<number[]>([]);

  // class answered_question {

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
  }
  // interface parcel2 {
  //   method: String;
  //   escalationlevel: Number;
  //   category?: String;
  //   subcategory?: String;
  //   question?: String;
  //   answer?: String;
  //   timecost?: Number;
  //   moneycost?: Number;
  // }
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
  async function GetData(escalationlevel: number, labelToChange: String) {
    switch (escalationlevel) {
      case 1:
        axios.post("/api/qizztaker", parcel1).then((resp) => {
          setcategory_Array(resp.data);
        });

      case 2:
        let parcel2: parcel = {
          escalationlevel: escalationlevel,
          category: labelToChange,
        };
        axios.post("/api/qizztaker", parcel2).then((resp) => {
          console.log(resp.data);
          setsub_category_Array(resp.data);
        });

      case 3:
        let parcel3: parcel = {
          escalationlevel: escalationlevel,
          category: category?.name,
          subcategory: labelToChange,
        };
        axios.post("/api/qizztaker", parcel3).then((resp) => {
          console.log(resp.data);
          setQuestion_Array(resp.data);
        });
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
        <div> A list of questions we have for you </div>
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

    async function handle_answer_question(answer: answer) {
      setanswer_Array((current) => [...current, answer]);
      // const newarray = Answer_Array.slice();
      // newarray.push(answer);
      // setanswer_Array(newarray);
    }
    // useEffect(() => {
    //   axios.post("/api/qizztaker", parcel1).then((resp) => {
    //     setanswer_Array((current) => [...current, pickedanswer!]);
    //     SetIsClicked(true);
    //   });
    // }, [pickedanswer]);
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
                      onClick={async () => {
                        // SetIsClicked(!IsClicked);
                        setanswer_Array((current) => [...current, answer]);
                        setAnsweredQuestionsArray((current) => [
                          ...current,
                          question.id,
                        ]);
                        // await handle_answer_question(answer);
                        //  SetIsClicked((prevState) => !prevState);
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
    return <div>{AnsweredQuestionsArray.length > 0 && <>{}</>}</div>;
  }

  return (
    <div>
      {stage === 1 && <CategoryBOX />}
      {stage === 2 && <SubcategoryBOX />}
      {stage === 3 && <QuestionBOX />}
      {}
    </div>
  );
};

export default QIZZTAKER;
