"use client";
import React from "react";
import { JobProvider } from "./JobContext";
import IQBrowser from "./nopage";

const qbpage = () => {
  return (
    <JobProvider>
      <IQBrowser />
    </JobProvider>
  );
};

export default qbpage;
