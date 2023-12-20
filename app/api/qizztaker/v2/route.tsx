import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import axios from "axios";
import {
  category,
  question,
  sub_category,
  answer,
  submitted_job,
} from "@prisma/client";

interface parcel2 {
  escalationlevel: Number;
  category?: String;
  subcategory?: String;
  question?: String;
  answer?: String;
  timecost?: Number;
  moneycost?: Number;
  method?: String;
  answeredquestions?: answer[];
  extrainfo?: String;
  lat?: Number;
  long?: Number;
  radius?: Number;
  email?: String;
}

interface distanceParcel {
  radius: Number;
  lat: Number;
  long: Number;
  //JobsArray: String;
  JobsArray: submitted_job[];
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parcel1: parcel2 = body;
  console.log(parcel1, "you are using v2 of the api");

  switch (parcel1.escalationlevel) {
    case 1:
      const categories: category[] = await prisma.category.findMany();
      return NextResponse.json(categories);
    case 2:
      const subcategories: sub_category[] = await prisma.sub_category.findMany({
        where: {
          categoryID: String(parcel1.category),
        },
      });

      return NextResponse.json(subcategories);

    case 3:
      const submitted_jobs: submitted_job[] =
        await prisma.submitted_job.findMany({
          orderBy: [
            {
              date_created: "desc",
            },
          ],
          where: {
            categoryID: String(parcel1.category),
            sub_categoryID: String(parcel1.subcategory),
            isVisible: true,
          },
        });

      const JobsArray1 = JSON.stringify(submitted_jobs);
      //const JobsArray1 = submitted_jobs.toString();

      let distanceParcel1: distanceParcel = {
        radius: Number(parcel1.radius),
        lat: Number(parcel1.lat),
        long: Number(parcel1.long),
        JobsArray: submitted_jobs,
        // JobsArray: submitted_jobs,
      };

      const result = await axios
        .post("http://localhost:8001/", distanceParcel1)
        .then((resp) => {
          //  console.log(resp.data);
          return NextResponse.json(resp.data);
        })
        .catch((error) => console.log(error));
      //  return NextResponse.json(submitted_jobs);
      //  return NextResponse.json(result);
      return result;
  }
  //  return NextResponse.json({ email: "newuser.email" });
}
