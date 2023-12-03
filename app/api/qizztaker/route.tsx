import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { category, question, sub_category, answer } from "@prisma/client";
import { authOptions } from "../auth/authOptions";
import { getServerSession } from "next-auth";
import { time } from "console";

interface parcel {
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
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const parcel1: parcel = body;
  // console.log(parcel1);

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

    case 5:
      let timecost = 0;
      let moneycost = 0;

      for (let i: number = 0; i < parcel1.answeredquestions?.length!; i++) {
        const tc: answer = await prisma.answer.findFirstOrThrow({
          where: {
            id: String(parcel1.answeredquestions![i].id),
            categoryID: String(parcel1.category),
            sub_categoryID: String(parcel1.subcategory),
            questionID: String(parcel1.answeredquestions![i].questionID),
            // id: "String(parcel1.answeredquestions![i].id",
          },
        });
        timecost = timecost + tc.timecost;
        moneycost = moneycost + tc.moneycost;

        // timecost = timecost + parcel1.answeredquestions![i].timecost;
        // moneycost = moneycost + parcel1.answeredquestions![i].moneycost;
      }

      const answeredQuestions1 = JSON.stringify(parcel1.answeredquestions);

      await prisma.submitted_job.create({
        data: {
          categoryID: String(parcel1.category),
          sub_categoryID: String(parcel1.subcategory),
          answeredQuestions: answeredQuestions1,
          isVisible: false,
          submittterEmail: session?.user.email!,
          extrainfo: String(parcel1.extrainfo),
          moneycost: moneycost,
          timecost: timecost,
        },
      });

    // const answeredquestions = parcel1.answeredquestions?.toString()

    // console.log(typeof parcel1.answeredquestions);
    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    // console.log(parcel1.answeredquestions);

    // console.log("parcel1 be like" + parcel1);
  }
  return NextResponse.json({
    result: "successfully persisted the results of the questionare",
  });
}
