"use client";
import React from "react";
import { JobProvider } from "./JobContext";
import IQBrowser from "./nopage";

const Qbpage = () => {
  return (
    <JobProvider>
      <IQBrowser />
    </JobProvider>
  );
};

export default Qbpage;
