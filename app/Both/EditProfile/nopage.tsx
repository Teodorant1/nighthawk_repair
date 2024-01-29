import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { question, answer, category, sub_category } from "@prisma/client";
import { useProfileState } from "./ProfileContext";
import { parcel } from "@/projecttypes";

const SellerProfile = () => {
  const context = useProfileState();
  const { status, data: session } = useSession();
  const [show, setShow] = useState(false);
  const [all_categories, set_all_categories] = useState<category[]>([]);
  const [all_subcategories, set_all_subcategories] = useState<sub_category[]>(
    []
  );
  const [my_subcategories, set_my_subcategories] = useState<category[]>([]);

  const parcel1: parcel = {
    escalationlevel: 1,
  };
  useEffect(() => {
    axios.post("/api/qizztaker", parcel1).then((resp) => {
      set_all_categories(resp.data);
    });
  }, []);

  return (
    <div>
      {status === "authenticated" && session.user.isRepairman === true && (
        <div> paloki</div>
      )}
    </div>
  );
};

export default SellerProfile;
