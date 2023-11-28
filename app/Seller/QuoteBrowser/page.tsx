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
  const [stage, setstage] = useState<number>(1);
  const [category, setcategory] = useState<category>();
  const [category_Array, setcategory_Array] = useState<category[]>();
  // const [sub_category, setsub_category] = useState<sub_category>();
  const [sub_category_Array, setsub_category_Array] =
    useState<sub_category[]>();
  const [submittedJob_Array, setsubmittedJob_Array] = useState<submitted_job[]>(
    []
  );
  const [currentJobID, setcurrentJobID] = useState<String>("1");

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
        };
        axios.post("/api/qizztaker/v2", parcel3).then((resp) => {
          console.log(resp.data);
          setsubmittedJob_Array(resp.data);
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
            {submittedJob_Array!.map((job) => (
              <div
                className='ml-3 center outline text-center font-bold py-2 px-4 rounded-md my-5'
                key={job.id}
                onClick={() => {
                  toggleShow(job.id);
                }}
              >
                <div>ID:{job.id}</div>
                <div>DATE OF CREATION: {String(job.date_created)}</div>
                <div>Email:{job.submittterEmail}</div>
                <div>Expected cost: {job.moneycost}</div>
                <div>Expected duration: {job.timecost}</div>
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
            ))}
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

  return (
    <div>
      {stage === 1 && <CategoryBOX />}
      {stage === 2 && <SubcategoryBOX />}
      {stage === 3 && <JOBbox />}
    </div>
  );
};

export default IQBrowser;
