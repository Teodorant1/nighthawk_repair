"use client";

import React from "react";

function registerUser() {
  console.log("details1");
}

const details = () => {
  return <div onClick={() => registerUser()}>details</div>;
};

export default details;
