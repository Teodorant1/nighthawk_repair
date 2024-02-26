import {
  JobPicture,
  answer,
  sub_category,
  tradesmanCandidateSubCategory,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface MyComponentProps {
  myStringProp: string;
}

export type parcel = {
  is_phone?: string;
  id?: string;
  escalationlevel?: number;
  category?: string;
  subcategory?: string;
  question?: string;
  answer?: string;
  timecost?: number;
  moneycost?: number;

  // string1?: string;
  // number1?: number;
  // string2?: string;
  // number2?: number;
  // string3?: string;
  // number3?: number;
  // string4?: string;
  // number4?: number;

  leadID?: string;
  userID?: string;
  SubmittedJobID?: string;
  status?: string;
  submitterEmail?: string;
  visibility?: boolean;
  tradesmanID?: string;
  isApproved?: boolean;

  link?: string;
  certificate?: string;

  method?: string;
  answeredquestions?: answer[];
  extrainfo?: string;

  radius?: number;
  email?: string;
  password?: string;
  name?: string;
  phonenum?: string;
  isOptional?: boolean;

  phone_number?: string;
  businessName?: string;
  businessAddress?: string;
  CompanyNumber?: string;
  LiabilityLicense?: string;
  subcategories?: sub_category[];

  lat?: number;
  long?: number;

  pictures?: string[];
  title?: string;
  timing?: string;
  hiringstage?: string;
  firstToBuy?: boolean;
  minbudget?: number;
  maxbudget?: number;
};

export interface CloudinaryResult {
  public_id: String;
}

export interface submitted_job_SANS_Email {
  id: string;
  sub_categoryID: string;
  categoryID: string;
  answeredQuestions: string;
  isVisible: boolean;
  // submittterEmail: string;
  date_created: Date;
  extrainfo?: string;
  timecost: number;
  moneycost: number;
  distance: number;
  latitude: Decimal;
  longitude: Decimal;
  title?: string;
  timing?: string;
  hiringstage?: string;
  first_to_buy?: boolean;
  minBudget: number;
  maxBudget: number;
  status?: string;
  finalWorkerID?: string;
  pictures: JobPicture[];
}

export interface submitted_job_WITH_Email {
  id: string;
  sub_categoryID: string;
  categoryID: string;
  answeredQuestions: string;
  isVisible: boolean;
  submittterEmail: string;
  date_created: Date;
  extrainfo?: string;
  timecost: number;
  moneycost: number;
  distance: number;
  latitude: Decimal;
  longitude: Decimal;
  title?: string;
  timing?: string;
  hiringstage?: string;
  first_to_buy?: boolean;
  minBudget: number;
  maxBudget: number;
  status?: string;
  finalWorkerID?: string;
  pictures: JobPicture[];
}

export interface tradesmanCandidateWSubcategories {
  id: string;
  userID: string;
  email: string;
  phoneNumber: string;
  name: string;
  BusinessName: string;
  BusinessAddress: string;
  CompanyNumber: string;
  Approved: boolean;
  LiabilityLicenseLink: string;
  SubCategories: tradesmanCandidateSubCategory[];
}

export interface distanceParcel {
  radius: number;
  lat: number;
  long: number;
  //JobsArray: String;
  JobsArray: submitted_job_SANS_Email[];
}

export interface ClickedPosition {
  lat: number;
  lng: number;
}

export interface UserLoc {
  TravelRange: number;
  latitude: number;
  longitude: number;
  isRepairman: boolean;
}

export interface Props1 {
  params: { id: string };
}
export type reviewCounter = {
  ones?: number;
  twos?: number;
  threes?: number;
  fours?: number;
  fives?: number;
  average?: number;
};
