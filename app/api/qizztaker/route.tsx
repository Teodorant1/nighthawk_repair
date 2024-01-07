import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { category, question, sub_category, answer } from "@prisma/client";
import { authOptions } from "../auth/authOptions";
import { getServerSession } from "next-auth";
import { time } from "console";
import { boolean } from "zod";

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

  email?: String;
  password?: String;
  name?: String;
  phonenum?: String;
  isOptional?: boolean;

  lat?: Number;
  long?: Number;

  title?: String;
  timing?: String;
  hiringstage?: String;
  firstToBuy?: boolean;
  minBudget?: number;
  maxBudget?: number;
  pictures?: String[];
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const parcel1: parcel = body;
  console.log(parcel1);

  switch (parcel1.escalationlevel) {
    case 1:
      const categories: category[] = await prisma.category.findMany();
      return NextResponse.json(categories);
    case 2:
      const subcategories: any[] = await prisma.sub_category.findMany({
        where: {
          categoryID: String(parcel1.category),
        },
        select: { id: true, name: true, categoryID: true, questions: false },
      });

      return NextResponse.json(subcategories);

    case 3:
      const questions: question[] = await prisma.question.findMany({
        where: {
          categoryID: String(parcel1.category),
          sub_categoryID: String(parcel1.subcategory),
          isOptional: Boolean(parcel1.isOptional),
        },
      });

      return NextResponse.json(questions);
    case 3.5:
      const questions1: question[] = await prisma.question.findMany({
        where: {
          categoryID: String(parcel1.category),
          sub_categoryID: String(parcel1.subcategory),
          isOptional: Boolean(parcel1.isOptional),
        },
      });

      return NextResponse.json(questions1);

    //  id
    //  sub_categoryID
    //  categoryID
    //  questionID
    //  text_answer
    case 4:
      const answers: any[] = await prisma.answer.findMany({
        where: {
          categoryID: String(parcel1.category),
          sub_categoryID: String(parcel1.subcategory),
          questionID: String(parcel1.question),
        },
        select: {
          id: true,
          sub_categoryID: true,
          categoryID: true,
          questionID: true,
          text_answer: true,
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

      const subjob = await prisma.submitted_job.create({
        data: {
          categoryID: String(parcel1.category),
          sub_categoryID: String(parcel1.subcategory),
          answeredQuestions: answeredQuestions1,
          isVisible: false,
          submittterEmail: session?.user.email!,
          extrainfo: String(parcel1.extrainfo),
          moneycost: moneycost,
          timecost: timecost,

          latitude: Number(parcel1.lat),
          longitude: Number(parcel1.long),
          title: String(parcel1.title),
          timing: String(parcel1.timing),
          hiringstage: String(parcel1.hiringstage),
          first_to_buy: parcel1.firstToBuy,
          minBudget: parcel1.minBudget,
          maxBudget: parcel1.maxBudget,
          // submittterEmail : String(parcel1.email)
        },
      });
      if (parcel1.pictures?.length! > 0) {
        for (let i: number = 0; i < parcel1.answeredquestions?.length!; i++) {
          await prisma.jobPicture.create({
            data: {
              cloudinaryID: String(parcel1.pictures![i]),
              submitted_jobId: subjob.id,
            },
          });
        }
      }

      // await prisma.jobPicture

      break;
    case 6:
      let timecost1 = 0;
      let moneycost1 = 0;

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
        timecost1 = timecost1 + tc.timecost;
        moneycost1 = moneycost1 + tc.moneycost;

        // timecost = timecost + parcel1.answeredquestions![i].timecost;
        // moneycost = moneycost + parcel1.answeredquestions![i].moneycost;
      }

      const answeredQuestions2 = JSON.stringify(parcel1.answeredquestions);

      const subjob1 = await prisma.submitted_job.create({
        data: {
          categoryID: String(parcel1.category),
          sub_categoryID: String(parcel1.subcategory),
          answeredQuestions: answeredQuestions2,
          isVisible: false,
          //  submittterEmail: session?.user.email!,
          extrainfo: String(parcel1.extrainfo),
          moneycost: moneycost1,
          timecost: timecost1,
          submittterEmail: String(parcel1.email),
          latitude: Number(parcel1.lat),
          longitude: Number(parcel1.long),
        },
      });
      if (parcel1.pictures?.length! > 0) {
        for (let i: number = 0; i < parcel1.answeredquestions?.length!; i++) {
          await prisma.jobPicture.create({
            data: {
              cloudinaryID: String(parcel1.pictures![i]),
              submitted_jobId: subjob1.id,
            },
          });
        }
      }
      if (parcel1.method === "CREATEACCOUNT") {
        await prisma.user.create({
          data: {
            email: String(parcel1.email),
            password: String(parcel1.password),
            role: "USER",
            phoneNum: String(parcel1.phonenum),
            name: String(parcel1.name),
          },
        });
      }
      break;

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
