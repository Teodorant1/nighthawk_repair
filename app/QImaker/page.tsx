"use client";

import React, { useState } from "react";
import { Category, Sub_Category, Question, Answer } from "@prisma/client";
import axios from "axios";

const QuizzMaker = () => {
  // const [Question, setQuestion] = useState<Question>();
  // const [Question_Array, setQuestion_Array] = useState<Question[]>();
  // const [answers, setanswers] = useState<Answer[]>();
  // const [Sub_Category, setSub_Category] = useState<Sub_Category>();

  function PersistToSQUEALdb(escalationlevel: number) {
    const category = (document.getElementById("Category") as HTMLInputElement)
      .value;
    const subcategory = (
      document.getElementById("Subcategory") as HTMLInputElement
    ).value;

    const question = (document.getElementById("Question") as HTMLInputElement)
      .value;
    const answer = (document.getElementById("Answer") as HTMLInputElement)
      .value;
    const timecost = (document.getElementById("timecost") as HTMLInputElement)
      .value;

    const moneycost = (document.getElementById("moneycost") as HTMLInputElement)
      .value;

    const parcel = {
      escalationlevel: escalationlevel,
      category: category,
      subcategory: subcategory,
      question: question,
      answer: answer,
      timecost: timecost,
      moneycost: moneycost,
    };

    axios
      .post("/api/QImaker", parcel)
      // .then((resp) => {
      //   const receivedinfo = resp.data;
      //   console.log(receivedinfo);
      // })
      .catch((error) => console.log(error));
  }

  return (
    <div>
      QuizzMaker
      <div>
        Category name:{" "}
        <input
          type='text'
          className='outline text-center font-bold py-2 px-4 rounded-full my-5'
          id='Category'
          placeholder='Category Goes Here'
        />{" "}
        <button
          className=' bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2 px-4 rounded-full '
          onClick={() => {
            PersistToSQUEALdb(1);
          }}
        >
          Click To Add Category
        </button>{" "}
        /SubCategory Name:{" "}
        <input
          type='text'
          className='outline text-center font-bold py-2 px-4 rounded-full my-5'
          id='Subcategory'
          placeholder='Subcategory Goes Here'
        />{" "}
        <button
          className=' bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2 px-4 rounded-full '
          onClick={() => {}}
        >
          Click To Add Subcategory
        </button>{" "}
      </div>
      <div>
        Question:{" "}
        <input
          type='text'
          className='outline text-center font-bold py-2 px-4 rounded-full my-5'
          id='Question'
          placeholder='Question Goes Here'
        />{" "}
        <button
          className=' bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2 px-4 rounded-full '
          onClick={() => {}}
        >
          Click To Add Question
        </button>{" "}
      </div>
      <div>
        Answer:{" "}
        <input
          type='text'
          className='outline text-center font-bold py-2 px-4 rounded-full my-5'
          id='Answer'
          placeholder='Answer Goes Here'
        />{" "}
        Time Cost:{" "}
        <input
          type='number'
          className='outline text-center font-bold py-2 px-4 rounded-full my-5'
          id='timecost'
          placeholder='Answer Goes Here'
        />{" "}
        Money Cost:{" "}
        <input
          type='number'
          className='outline text-center font-bold py-2 px-4 rounded-full my-5'
          id='moneycost'
          placeholder='Answer Goes Here'
        />{" "}
        <button
          className=' bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2 px-4 rounded-full '
          onClick={() => {}}
        >
          Click To Add Question
        </button>{" "}
      </div>
    </div>
  );
};

export default QuizzMaker;
