import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import axios from "axios";
import {
  parcel,
  distanceParcel,
  submitted_job_SANS_Email,
} from "@/projecttypes";
import { authOptions } from "../auth/authOptions";
import { Session, getServerSession } from "next-auth";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const session: Session = (await getServerSession(authOptions)) as Session;
  const body = await req.json();
  const parcel1: parcel = body;

  if (parcel1.method === "getAggregatedJobsForUser") {
    if (session.user.sub === parcel1.userID) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      let aggregatedResults: submitted_job_SANS_Email[] = [];
      const criteriaList = await prisma.profileSubCategory.findMany({
        where: {
          user_ID: parcel1.userID,
        },
      });

      for (const criteria of criteriaList) {
        try {
          const result1 = await prisma.submitted_job.findMany({
            orderBy: [
              {
                date_created: "desc",
              },
            ],
            where: {
              sub_categoryID: criteria.subcategory,
              categoryID: criteria.category,
              date_created: {
                gte: sevenDaysAgo,
              },
              isVisible: true,
            },
            select: {
              id: true,
              sub_categoryID: true,
              categoryID: true,
              answeredQuestions: true,
              optional_answeredQuestions: true,
              isVisible: true,
              // submittterEmail: false,
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
              postalCode: true,
            },
            // Add other options if needed (e.g., select, orderBy, etc.)
          });

          let result = result1 as submitted_job_SANS_Email[];

          // Aggregate results into the array
          aggregatedResults = aggregatedResults.concat(result);
        } catch (error) {
          console.error(`Error fetching data: ${error}`);
        }
      }

      const currentuser = await prisma.user.findFirst({
        where: {
          id: session.user.sub,
        },
      });

      let distanceParcel1: distanceParcel = {
        radius: Number(currentuser?.TravelRange!),
        lat: Number(currentuser?.latitude!),
        long: Number(currentuser?.longitude!),
        JobsArray: aggregatedResults,
      };

      const result = await axios
        .post(process.env.NEXT_PUBLIC_HaversinEndpoint!, distanceParcel1)
        .then((resp) => {
          return resp.data;
        })
        .catch((error) => console.log(error));

      console.log("getAggregatedJobsForUser");
      console.log(result);

      return NextResponse.json(result);
    }
    const submitted_job_SANS_Email1111: submitted_job_SANS_Email[] = [];
    return NextResponse.json(submitted_job_SANS_Email1111);
  }
  if (parcel1.method === "getSingularJob") {
    if (session.user.sub === parcel1.userID) {
      const subjob = await prisma.submitted_job.findFirst({
        where: { id: parcel1.SubmittedJobID },
        include: { pictures: true },
      });

      return NextResponse.json(subjob);
    }
  }
  if (parcel1.method === "tag_Applied_Job") {
    if (session.user.sub === parcel1.userID) {
      const newappliedjob = await prisma.appliedJob.update({
        where: { id: parcel1.id },
        data: {
          status: parcel1.status,
        },
      });

      return NextResponse.json(newappliedjob);
    }
  }
  if (parcel1.method === "GetBuyerJoblist") {
    if (session.user.sub === parcel1.userID) {
      const buyerjoblist = await prisma.submitted_job.findMany({
        where: { submittterEmail: parcel1.submitterEmail },
        include: { pictures: true },
        orderBy: { date_created: "desc" },
      });
      return NextResponse.json(buyerjoblist);
    }
  }
  if (parcel1.method === "GetBuyerJobApplications") {
    if (session.user.sub === parcel1.userID) {
      const subjob_applications = await prisma.appliedJob.findMany({
        where: { submittedJob_ID: parcel1.SubmittedJobID },
        select: {
          id: true,
          submittedJob_ID: true,
          submitterEmail: true,
          // status: false,
          userID: true,
        },
      });
      return NextResponse.json(subjob_applications);
    }
  }
  if (parcel1.method === "getAllSubcategories") {
    const subcategories = await prisma.sub_category.findMany();
    return NextResponse.json(subcategories);
  }
  if (parcel1.method === "ToggleJobVisibility") {
    if (session.user.sub === parcel1.userID) {
      await prisma.submitted_job.update({
        where: {
          submittterEmail: parcel1.submitterEmail,
          id: parcel1.SubmittedJobID,
        },
        data: { isVisible: parcel1.visibility },
      });

      const buyerjoblist = await prisma.submitted_job.findMany({
        where: { submittterEmail: parcel1.submitterEmail },
        include: { pictures: true },
        orderBy: { date_created: "desc" },
      });

      return NextResponse.json(buyerjoblist);
    }
  }
  if (parcel1.method === "handleCandidateTradesmanApproval") {
    if (session.user.isAdmin === true) {
      if (parcel1.isApproved === true) {
        const candidate = await prisma.tradesmanCandidate.update({
          where: { id: parcel1.tradesmanID },
          data: {
            Approved: true,
          },
        });

        await prisma.user.update({
          where: { id: candidate.userID },
          data: { isRepairman: true },
        });
      }
      if (parcel1.isApproved === false) {
        const candidate = await prisma.tradesmanCandidate.findFirst({
          where: {
            id: parcel1.tradesmanID,
          },
        });

        await prisma.user.delete({ where: { id: candidate?.userID } });
        await prisma.tradesmanCandidateSubCategory.deleteMany({
          where: { tradesmanCandidateId: candidate?.userID },
        });
        await prisma.tradesmanCandidate.delete({
          where: { id: candidate?.id },
          // include: { SubCategories: true },
        });
      }

      const candidates = await prisma.tradesmanCandidate.findMany({
        where: { Approved: false },
        include: { SubCategories: true },
      });

      return NextResponse.json(candidates);
    }
  }
  if (parcel1.method === "GetTradesManCandidateList") {
    if (session.user.isAdmin === true) {
      const candidates = await prisma.tradesmanCandidate.findMany({
        where: { Approved: false },
        include: { SubCategories: true },
      });
      return NextResponse.json(candidates);
    }
  }
  if (parcel1.method === "RegisterTradesman") {
    const hashedpassword = await bcrypt.hash(parcel1.password!, 10);

    const newuser = await prisma.user.create({
      data: {
        email: parcel1.email!,
        password: hashedpassword,
        role: "USER",
        phoneNum: parcel1.phone_number!,
        name: parcel1.name!,
      },
    });

    await prisma.userNotificationConfig.create({
      data: {
        userId: newuser.id,
      },
    });

    const tradesmanCandidate = await prisma.tradesmanCandidate.create({
      data: {
        userID: newuser.id,
        email: parcel1.email!,
        phoneNumber: parcel1.phone_number!,
        name: parcel1.name!,
        BusinessName: parcel1.businessName!,
        BusinessAddress: parcel1.businessAddress!,
        CompanyNumber: parcel1.CompanyNumber!,
        LiabilityLicenseLink: parcel1.LiabilityLicense!,
      },
    });
    for (let i: number = 0; i < parcel1.subcategories!.length; i++) {
      await prisma.profileSubCategory.create({
        data: {
          subcategory: parcel1.subcategories![i].name!,
          category: parcel1.subcategories![i].categoryID!,
          user_ID: tradesmanCandidate.id,
        },
      });
    }
    for (let i: number = 0; i < parcel1.subcategories!.length; i++) {
      await prisma.tradesmanCandidateSubCategory.create({
        data: {
          SubCategory: parcel1.subcategories![i].name!,
          categoryID: parcel1.subcategories![i].categoryID!,
          tradesmanCandidateId: tradesmanCandidate.id,
        },
      });
    }

    return NextResponse.json({ email: "newuser.email" });
  }

  return NextResponse.json({ email: "newuser.email" });
}
