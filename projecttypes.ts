import { JobPicture, answer } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type parcel = {
  escalationlevel?: number;
  category?: string;
  subcategory?: string;
  question?: string;
  answer?: string;
  timecost?: number;
  moneycost?: number;

  string1?: string;
  number1?: number;
  string2?: string;
  number2?: number;
  string3?: string;
  number3?: number;
  string4?: string;
  number4?: number;

  leadID?: string;
  userID?: string;

  method?: string;
  answeredquestions?: answer[];
  extrainfo?: string;

  radius?: number;
  email?: string;
  password?: string;
  name?: string;
  phonenum?: string;
  isOptional?: boolean;

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

export interface submitted_job_SANS_Email {
  id: string;
  sub_categoryID: string;
  categoryID: string;
  answeredQuestions: string;
  isVisible: Boolean;
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
  first_to_buy?: Boolean;
  minBudget: number;
  maxBudget: number;
  status?: string;
  finalWorkerID?: string;
  pictures: JobPicture[];
}

export interface distanceParcel {
  radius: number;
  lat: number;
  long: number;
  //JobsArray: String;
  JobsArray: submitted_job_SANS_Email[];
}

export function paloki(input: string) {
  console.log(input);
}

export interface ClickedPosition {
  lat: number;
  lng: number;
}
