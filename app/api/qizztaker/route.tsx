import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { category, question, sub_category, answer } from "@prisma/client";
import { authOptions } from "../auth/authOptions";
import { Session, getServerSession } from "next-auth";
import { parcel } from "@/projecttypes";

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session;
  const body = await req.json();
  const parcel1: parcel = body;

  switch (parcel1.escalationlevel) {
    case 1:
      const categories: category[] = await prisma.category.findMany();
      return NextResponse.json(categories);
    case 2:
      const subcategories: any[] = await prisma.sub_category.findMany({
        where: {
          categoryID: parcel1.category,
        },
        select: { id: true, name: true, categoryID: true },
      });

      return NextResponse.json(subcategories);

    case 3:
      const questions: question[] = await prisma.question.findMany({
        where: {
          categoryID: parcel1.category,
          sub_categoryID: parcel1.subcategory,
          isOptional: parcel1.isOptional,
        },
      });

      return NextResponse.json(questions);
    case 3.5:
      const questions1: question[] = await prisma.question.findMany({
        where: {
          categoryID: parcel1.category,
          sub_categoryID: parcel1.subcategory,
          isOptional: parcel1.isOptional,
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
            id: parcel1.answeredquestions![i].id,
            categoryID: parcel1.category,
            sub_categoryID: parcel1.subcategory,
            questionID: parcel1.answeredquestions![i].questionID,
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
          categoryID: parcel1.category!,
          sub_categoryID: parcel1.subcategory!,
          answeredQuestions: answeredQuestions1,
          isVisible: false,
          submittterEmail: session?.user.email!,
          extrainfo: parcel1.extrainfo,
          moneycost: moneycost,
          timecost: timecost,

          latitude: parcel1.lat,
          longitude: parcel1.long,
          title: parcel1.title,
          timing: parcel1.timing,
          hiringstage: parcel1.hiringstage,
          first_to_buy: parcel1.firstToBuy,
          minBudget: parcel1.minbudget,
          maxBudget: parcel1.maxbudget,
          postalCode: parcel1.postalCode,
          // submittterEmail : parcel1.email
        },
      });
      if (parcel1.pictures?.length! > 0) {
        for (let i: number = 0; i < parcel1.pictures?.length!; i++) {
          await prisma.jobPicture.create({
            data: {
              cloudinaryID: parcel1.pictures![i],
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
            id: parcel1.answeredquestions![i].id,
            categoryID: parcel1.category,
            sub_categoryID: parcel1.subcategory,
            questionID: parcel1.answeredquestions![i].questionID,
            // id: "parcel1.answeredquestions![i].id",
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
          categoryID: parcel1.category!,
          sub_categoryID: parcel1.subcategory!,
          answeredQuestions: answeredQuestions2,
          isVisible: false,
          //  submittterEmail: session?.user.email!,
          extrainfo: parcel1.extrainfo!,
          moneycost: moneycost1,
          timecost: timecost1,
          submittterEmail: parcel1.email!,
          latitude: parcel1.lat,
          longitude: parcel1.long,
          title: parcel1.title,
          timing: parcel1.timing,
          hiringstage: parcel1.hiringstage,
          first_to_buy: parcel1.firstToBuy,
          minBudget: parcel1.minbudget,
          maxBudget: parcel1.maxbudget,
          postalCode: parcel1.postalCode,
        },
      });
      if (parcel1.pictures?.length! > 0) {
        for (let i: number = 0; i < parcel1.pictures?.length!; i++) {
          await prisma.jobPicture.create({
            data: {
              cloudinaryID: parcel1.pictures![i],
              submitted_jobId: subjob1.id,
            },
          });
        }
      }
      if (parcel1.method === "CREATEACCOUNT") {
        await prisma.user.create({
          data: {
            email: parcel1.email!,
            password: parcel1.password!,
            role: "USER",
            phoneNum: parcel1.phonenum!,
            name: parcel1.name!,
          },
        });
      }
      break;
  }
  return NextResponse.json({
    result: "successfully persisted the results of the questionare",
  });
}
