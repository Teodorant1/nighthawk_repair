"use client";
import React from "react";
import { AppProvider } from "./iqtContext";
import QIZZTAKER from "./nopage";

const iqtpage = () => {
  return (
    <AppProvider>
      <QIZZTAKER />
    </AppProvider>
  );
};

export default iqtpage;
