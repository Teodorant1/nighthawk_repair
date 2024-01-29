"use client";
import React from "react";
import { ProfileProvider } from "./ProfileContext";
import SellerProfile from "./nopage";

const Myprofile = () => {
  return (
    <ProfileProvider>
      <SellerProfile />
    </ProfileProvider>
  );
};

export default Myprofile;
