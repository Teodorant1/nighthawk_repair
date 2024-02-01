"use client";
import React from "react";
import { ProfileProvider } from "./ProfileContext";
import SellerProfile from "./nopage";
import { Props1 } from "@/projecttypes";
const Myprofile = ({ params: { id } }: Props1) => {
  return (
    <ProfileProvider>
      <>
        <SellerProfile
          params={{
            id: id,
          }}
        />
      </>
    </ProfileProvider>
  );
};

export default Myprofile;
