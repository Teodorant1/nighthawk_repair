"use client";

import React, { useState } from "react";
import { Category, Sub_Category, Question, Answer } from "@prisma/client";

const QuizzMaker = () => {
  const [Question, setQuestion] = useState<Question>();
  const [Question_Array, setQuestion_Array] = useState<Question[]>();
  const [answers, setanswers] = useState<Answer[]>();
  const [Sub_Category, setSub_Category] = useState<Sub_Category>();

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
        / Category name:{" "}
        <input
          type='text'
          className='outline text-center font-bold py-2 px-4 rounded-full my-5'
          id='Category'
          placeholder='Category Goes Here'
        />{" "}
      </div>
      <div>
        Question:{" "}
        <input
          type='text'
          className='outline text-center font-bold py-2 px-4 rounded-full my-5'
          id='Question'
          placeholder='Question Goes Here'
        />{" "}
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
