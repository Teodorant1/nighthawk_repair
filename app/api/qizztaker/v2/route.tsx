import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { category, question, sub_category, answer } from "@prisma/client";

interface parcel2 {
  method: String;
  escalationlevel: Number;
  category?: String;
  subcategory?: String;
  question?: String;
  answer?: String;
  timecost?: Number;
  moneycost?: Number;
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parcel1: parcel2 = body;
  console.log(parcel1);

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
      const questions: question[] = await prisma.question.findMany({
        where: {
          categoryID: String(parcel1.category),
          sub_categoryID: String(parcel1.subcategory),
        },
      });

      return NextResponse.json(questions);

    case 4:
      const answers: answer[] = await prisma.answer.findMany({
        where: {
          categoryID: String(parcel1.category),
          sub_categoryID: String(parcel1.subcategory),
          questionID: String(parcel1.question),
        },
      });
      return NextResponse.json(answers);
  }
  //  return NextResponse.json({ email: "newuser.email" });
}
