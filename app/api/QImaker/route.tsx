import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

interface parcel {
  escalationlevel: Number;
  category: String;
  subcategory?: String;
  question?: String;
  answer?: String;
  timecost?: Number;
  moneycost?: Number;
  isOptional?: boolean;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parcel1: parcel = body;
  console.log(
    typeof body.escalationlevel,
    typeof parcel1.escalationlevel,
    body.escalationlevel,
    parcel1.escalationlevel
  );

  switch (parcel1.escalationlevel) {
    case 1:
      await prisma.category.create({
        data: {
          name: String(parcel1.category),
        },
      });

      break;
    case 2:
      await prisma.sub_category.create({
        data: {
          name: String(parcel1.subcategory),
          categoryID: String(parcel1.category),
        },
      });
      break;
    case 3:
      await prisma.question.create({
        data: {
          text_Question: String(parcel1.question),
          sub_categoryID: String(parcel1.subcategory),
          categoryID: String(parcel1.category),
          isOptional: Boolean(parcel1.isOptional),
        },
      });
      break;
    case 4:
      await prisma.answer.create({
        data: {
          categoryID: String(parcel1.category),
          sub_categoryID: String(parcel1.subcategory),
          questionID: String(parcel1.question),
          text_answer: String(parcel1.answer),
          //gbp
          moneycost: Number(parcel1.moneycost),
          //days
          timecost: Number(parcel1.timecost),
        },
      });
      break;
  }

  return NextResponse.json({ email: "paloki" });
}
