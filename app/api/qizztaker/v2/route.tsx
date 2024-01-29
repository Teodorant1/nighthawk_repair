import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import axios from "axios";
import {
  parcel,
  distanceParcel,
  submitted_job_SANS_Email,
} from "@/projecttypes";
import { category, sub_category } from "@prisma/client";
import { authOptions } from "../../auth/authOptions";
import { Session, getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session;
  const body = await req.json();
  const parcel1: parcel = body;

  switch (parcel1.escalationlevel) {
    case 1:
      const categories: category[] = await prisma.category.findMany();
      return NextResponse.json(categories);
    case 2:
      const subcategories: sub_category[] = await prisma.sub_category.findMany({
        where: {
          categoryID: parcel1.category,
        },
      });

      return NextResponse.json(subcategories);

    case 3:
      const submitted_jobs = (await prisma.submitted_job.findMany({
        orderBy: [
          {
            date_created: "desc",
          },
        ],

        where: {
          categoryID: parcel1.category,
          sub_categoryID: parcel1.subcategory,
          isVisible: true,
        },

        select: {
          id: true,
          sub_categoryID: true,
          categoryID: true,
          answeredQuestions: true,
          optional_answeredQuestions: true,
          isVisible: true,
          // submittterEmail: true,
          date_created: true,
          extrainfo: true,
          timecost: true,
          moneycost: true,

          distance: true,
          latitude: true,
          longitude: true,

          title: true,
          timing: true,
          hiringstage: true,
          first_to_buy: true,
          minBudget: true,
          maxBudget: true,
          status: true,
          finalWorkerID: true,
          pictures: true,
        },
      })) as submitted_job_SANS_Email[];

      let distanceParcel1: distanceParcel = {
        radius: parcel1.radius!,
        lat: parcel1.lat!,
        long: parcel1.long!,
        JobsArray: submitted_jobs,
      };

      const result = await axios
        .post("http://localhost:8001/", distanceParcel1)
        .then((resp) => {
          return NextResponse.json(resp.data);
        })
        .catch((error) => console.log(error));
      //  return NextResponse.json(submitted_jobs);
      //  return NextResponse.json(result);
      return result;
  }

  if (parcel1.method === "getCoins" && parcel1.userID === session.user.sub) {
    const TradesmanCredit = await prisma.user.findFirst({
      where: { id: parcel1.userID },

      select: { coins: true },
    });

    return NextResponse.json(TradesmanCredit);
  }
  if (parcel1.method === "BuyAlead" && parcel1.userID === session.user.sub) {
    const CoinPerson = await prisma.user.findFirst({
      where: { id: parcel1.userID },
      select: { coins: true },
    });

    if (CoinPerson !== null && CoinPerson.coins! >= 20) {
      let new_coins: number = CoinPerson?.coins! - 20;

      const CoinPerson2 = await prisma.user.update({
        where: { id: parcel1.userID },
        data: { coins: new_coins },
      });

      const JobThatIsBeingAppliedTo = await prisma.submitted_job.findFirst({
        where: { id: parcel1.leadID },
      });

      await prisma.appliedJob.create({
        data: {
          submittedJob_ID: parcel1.leadID!,
          submitterEmail: JobThatIsBeingAppliedTo?.submittterEmail!,
          status: "contacted",
          userID: parcel1.userID,
        },
      });
    }
    return NextResponse.json(CoinPerson);
  }

  if (
    parcel1.method === "getappliedjobs" &&
    parcel1.userID === session.user.sub
  ) {
    const AppliedJobs = await prisma.appliedJob.findMany({
      where: { userID: parcel1.userID },
    });

    return NextResponse.json(AppliedJobs);
  }

  //  return NextResponse.json({ email: "newuser.email" });
}
