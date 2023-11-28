import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
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
      return NextResponse.json(submitted_jobs);
  }
  //  return NextResponse.json({ email: "newuser.email" });
}
