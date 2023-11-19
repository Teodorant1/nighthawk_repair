"use client";

import React, { useState } from "react";
import { Category, Sub_Category, Question, Answer } from "@prisma/client";

const QuizzMaker = () => {
  const [Question, setQuestion] = useState<Question>();
  const [Question_Array, setQuestion_Array] = useState<Question[]>();
  const [answers, setanswers] = useState<Answer[]>();
  const [Sub_Category, setSub_Category] = useState<Sub_Category>();

  function PersistToSQUEALdb(escalationlevel: number) {}

  return (
    <div>
      QuizzMaker
      <div>
        SubCategory Name:{" "}
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
        / Category name:{" "}
        <input
          type='text'
          className='outline text-center font-bold py-2 px-4 rounded-full my-5'
          id='Category'
          placeholder='Category Goes Here'
        />{" "}
        <button
          className=' bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2 px-4 rounded-full '
          onClick={() => {}}
        >
          Click To Add Category
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
          Click To Add Category
        </button>{" "}
      </div>
      <div>
        :Answers <div></div>{" "}
      </div>
      <div>
        Add Answer -{" "}
        <input
          type='text'
          className='outline text-center font-bold py-2 px-4 rounded-full my-5'
          id='Answer'
          placeholder='Answer Goes Here'
        />{" "}
      </div>
    </div>
  );
};

export default QuizzMaker;
