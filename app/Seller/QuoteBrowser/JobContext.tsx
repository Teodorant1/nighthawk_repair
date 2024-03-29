// JobContext.tsx
import { appliedJob, category, sub_category } from "@prisma/client";
import React, { createContext, useContext, ReactNode, useState } from "react";
import { submitted_job_SANS_Email } from "@/projecttypes";

interface JobContextProps {
  children: ReactNode;
}

interface JobContextValues {
  userLocation: any;
  setUserLocation: React.Dispatch<React.SetStateAction<any>>;
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
  stage: number;
  setStage: React.Dispatch<React.SetStateAction<number>>;
  category: category;
  setCategory: React.Dispatch<React.SetStateAction<category>>;
  categoryArray: category[];
  setCategoryArray: React.Dispatch<React.SetStateAction<category[]>>;
  subCategoryArray: sub_category[];
  setSubCategoryArray: React.Dispatch<React.SetStateAction<sub_category[]>>;
  submittedJobArray: submitted_job_SANS_Email[];
  setSubmittedJobArray: React.Dispatch<
    React.SetStateAction<submitted_job_SANS_Email[]>
  >;
  appliedJobs: appliedJob[];
  setappliedJobs: React.Dispatch<React.SetStateAction<appliedJob[]>>;
  filterBoxEnabled: boolean;
  setFilterBoxEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  timingPresets: string[];
  setTimingPresets: React.Dispatch<React.SetStateAction<string[]>>;
  hiringStagePresets: string[];
  setHiringStagePresets: React.Dispatch<React.SetStateAction<string[]>>;
  currentJobID: string;
  setCurrentJobID: React.Dispatch<React.SetStateAction<string>>;
  timingCriteria: string[];
  setTimingCriteria: React.Dispatch<React.SetStateAction<string[]>>;
  hiringStageCriteria: string[];
  setHiringStageCriteria: React.Dispatch<React.SetStateAction<string[]>>;
  budgetPresets: number[];
  setBudgetPresets: React.Dispatch<React.SetStateAction<number[]>>;
  minBudget: number;
  setMinBudget: React.Dispatch<React.SetStateAction<number>>;
  maxBudget: number;
  setMaxBudget: React.Dispatch<React.SetStateAction<number>>;
  picturesRequired: boolean;
  setPicturesRequired: React.Dispatch<React.SetStateAction<boolean>>;
  firstTobuy: boolean;
  setFirstToBuy: React.Dispatch<React.SetStateAction<boolean>>;
  userLocationText: string;
  setUserLocationText: React.Dispatch<React.SetStateAction<string>>;
  COINS: number;
  setCOINS: React.Dispatch<React.SetStateAction<number>>;
  leads_to_look_at: string;
  setleads_to_look_at: React.Dispatch<React.SetStateAction<string>>;
  myLead_filter_Presets: string[];
  setmyLead_filter_Presets: React.Dispatch<React.SetStateAction<string[]>>;
  myLead_filter_Current_Setting: string;
  setmyLead_filter_Current_Setting: React.Dispatch<
    React.SetStateAction<string>
  >;
  currentdropdown: string;
  setcurrentdropdown: React.Dispatch<React.SetStateAction<string>>;
}

const JobContext = createContext<JobContextValues | undefined>(undefined);

export const useJobContext = (): JobContextValues => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobContext must be used within a JobProvider");
  }
  return context;
};

export const JobProvider: React.FC<JobContextProps> = ({ children }) => {
  const [myLead_filter_Presets, setmyLead_filter_Presets] = useState<string[]>([
    "ALL",
    "REQUEST RATING",
    "MARK AS WON",
    "COULDN'T QUOTE",
    "ARCHIVE",
    "INVOICE",
    "CANCEL",
    "LOST",
    "CONTACTED",
  ]);
  const [myLead_filter_Current_Setting, setmyLead_filter_Current_Setting] =
    useState<string>("ALL");
  const [currentdropdown, setcurrentdropdown] = useState<string>("none");
  const [userLocationText, setUserLocationText] = useState<string>(
    "Testing the alt tab error"
  );
  const [COINS, setCOINS] = useState<number>(0);
  const [leads_to_look_at, setleads_to_look_at] = useState<string>("newleads");

  const [userLocation, setUserLocation] = useState<any>(null);
  const [radius, setRadius] = useState<number>(25);
  const [stage, setStage] = useState<number>(3);
  const [category, setCategory] = useState<category>({
    id: "0",
    name: "faloki",
  });
  const [categoryArray, setCategoryArray] = useState<category[]>([]);
  const [subCategoryArray, setSubCategoryArray] = useState<sub_category[]>([]);
  const [submittedJobArray, setSubmittedJobArray] = useState<
    submitted_job_SANS_Email[]
  >([]);
  const [appliedJobs, setappliedJobs] = useState<appliedJob[]>([]);
  const [filterBoxEnabled, setFilterBoxEnabled] = useState<boolean>(false);
  const [timingPresets, setTimingPresets] = useState<string[]>([
    "URGENTLY",
    "WITHIN 2 DAYS",
    "WITHIN 2 WEEKS",
    "WITHIN 2 MONTHS",
    "WITHIN 6 MONTHS",
    "6 MONTHS PLUS",
  ]);
  const [hiringStagePresets, setHiringStagePresets] = useState<string[]>([
    "Ready to hire",
    "Insurance Quote",
    "Just Looking",
  ]);
  const [currentJobID, setCurrentJobID] = useState<string>("1");
  const [timingCriteria, setTimingCriteria] = useState<string[]>([
    "URGENTLY",
    "WITHIN 2 DAYS",
    "WITHIN 2 WEEKS",
    "WITHIN 2 MONTHS",
    "WITHIN 6 MONTHS",
    "6 MONTHS PLUS",
  ]);
  const [hiringStageCriteria, setHiringStageCriteria] = useState<string[]>([
    "Ready to hire",
    "Insurance Quote",
  ]);
  const [budgetPresets, setBudgetPresets] = useState<number[]>([
    0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000,
  ]);
  const [minBudget, setMinBudget] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(30000);
  const [picturesRequired, setPicturesRequired] = useState<boolean>(false);
  const [firstTobuy, setFirstToBuy] = useState<boolean>(false);

  const contextValue: JobContextValues = {
    userLocation,
    setUserLocation,
    radius,
    setRadius,
    stage,
    setStage,
    category,
    setCategory,
    categoryArray,
    setCategoryArray,
    subCategoryArray,
    setSubCategoryArray,
    submittedJobArray,
    setSubmittedJobArray,
    appliedJobs,
    setappliedJobs,
    filterBoxEnabled,
    setFilterBoxEnabled,
    timingPresets,
    setTimingPresets,
    hiringStagePresets,
    setHiringStagePresets,
    currentJobID,
    setCurrentJobID,
    timingCriteria,
    setTimingCriteria,
    hiringStageCriteria,
    setHiringStageCriteria,
    budgetPresets,
    setBudgetPresets,
    minBudget,
    setMinBudget,
    maxBudget,
    setMaxBudget,
    picturesRequired,
    setPicturesRequired,
    firstTobuy,
    setFirstToBuy,
    userLocationText,
    setUserLocationText,
    COINS,
    setCOINS,
    leads_to_look_at,
    setleads_to_look_at,
    myLead_filter_Presets,
    setmyLead_filter_Presets,
    myLead_filter_Current_Setting,
    setmyLead_filter_Current_Setting,
    currentdropdown,
    setcurrentdropdown,
  };

  return (
    <JobContext.Provider value={contextValue}>{children}</JobContext.Provider>
  );
};
