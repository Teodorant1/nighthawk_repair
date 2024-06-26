import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import axios from "axios";
import {
  parcel,
  distanceParcel,
  submitted_job_SANS_Email,
  MobileSession,
} from "@/projecttypes";
import { authOptions } from "../auth/authOptions";
import { Session, getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { answer, category, question, sub_category } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parcel1: parcel = body;
  //const session: Session = (await getServerSession(authOptions)) as Session;
  const session: MobileSession = parcel1.session!;

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

  if (parcel1.method === "getLocation") {
    const stuffToEdit = await prisma.user.findFirst({
      where: { id: parcel1.userID },

      select: {
        TravelRange: true,
        latitude: true,
        longitude: true,
        isRepairman: true,
      },
    });

    return NextResponse.json(stuffToEdit);
  }

  if (parcel1.method === "setLocation" && session.user.sub === parcel1.userID) {
    await prisma.user.update({
      where: { id: parcel1.userID },
      data: {
        latitude: parcel1.lat,
        longitude: parcel1.long,
      },
    });

    const stuffToEdit = await prisma.user.findFirst({
      where: { id: parcel1.userID },

      select: {
        TravelRange: true,
        latitude: true,
        longitude: true,
      },
    });

    return NextResponse.json(stuffToEdit);
  }

  if (
    parcel1.method === "setTravelRange" &&
    session.user.sub === parcel1.userID
  ) {
    await prisma.user.update({
      where: { id: parcel1.userID },
      data: {
        TravelRange: parcel1.radius,
      },
    });
    return NextResponse.json(parcel1);
  }

  if (parcel1.method === "getCategories") {
    const categories: category[] = await prisma.category.findMany();
    return NextResponse.json(categories);
  }

  if (
    parcel1.method === "AddProfileSubcat" &&
    session.user.sub === parcel1.userID
  ) {
    await prisma.profileSubCategory.create({
      data: {
        user_ID: parcel1.userID!,
        category: parcel1.category!,
        subcategory: parcel1.subcategory!,
      },
    });

    const my_subcategories = await prisma.profileSubCategory.findMany({
      where: {
        user_ID: parcel1.userID,
      },
      orderBy: [{ category: "desc" }],
    });

    return NextResponse.json(my_subcategories);
  }
  if (
    parcel1.method === "DeleteProfileSubcat" &&
    session.user.sub === parcel1.userID
  ) {
    await prisma.profileSubCategory.delete({
      where: {
        id: parcel1.id,
        user_ID: parcel1.userID!,
        category: parcel1.category!,
        subcategory: parcel1.subcategory!,
      },
    });

    const my_subcategories = await prisma.profileSubCategory.findMany({
      where: {
        user_ID: parcel1.userID,
      },
      orderBy: [{ category: "desc" }],
    });

    return NextResponse.json(my_subcategories);
  }

  if (parcel1.method === "getSubcategories") {
    const subcategories = await prisma.sub_category.findMany({
      // where: {
      //   categoryID: parcel1.category,
      // },
      orderBy: [{ categoryID: "desc" }],
      select: { id: true, name: true, categoryID: true },
    });

    return NextResponse.json(subcategories);
  }
  if (parcel1.method === "getMYSubcategories") {
    const my_subcategories = await prisma.profileSubCategory.findMany({
      where: {
        user_ID: parcel1.userID,
      },
      orderBy: [{ category: "desc" }],
    });

    return NextResponse.json(my_subcategories);
  }
  if (parcel1.method === "getreviews") {
    const reviews = await prisma.review.findMany({
      where: { WorkerID: parcel1.userID },
    });

    return NextResponse.json(reviews);
  }
  if (parcel1.method === "getcertificates") {
    const certificates = await prisma.certificate.findMany({
      where: { user_ID: parcel1.userID },
    });

    return NextResponse.json(certificates);
  }

  if (
    parcel1.method === "Deletecertificate" &&
    session.user.sub === parcel1.userID
  ) {
    await prisma.certificate.delete({
      where: { user_ID: parcel1.userID, id: parcel1.id },
    });
    const certificates = await prisma.certificate.findMany({
      where: { user_ID: parcel1.userID },
    });
    return NextResponse.json(certificates);
  }
  if (
    parcel1.method === "addCertificate" &&
    session.user.sub === parcel1.userID
  ) {
    await prisma.certificate.create({
      data: {
        user_ID: parcel1.userID!,
        name: parcel1.certificate!,
        Link: parcel1.link!,
      },
    });

    const certificates = await prisma.certificate.findMany({
      where: { user_ID: parcel1.userID },
    });

    return NextResponse.json(certificates);
  }
  if (parcel1.method === "getworkgallery") {
    const workgallery = await prisma.workGalleryPicture.findMany({
      where: { user_ID: parcel1.userID },
    });

    return NextResponse.json(workgallery);
  }
  if (
    parcel1.method === "addworkgallery" &&
    session.user.sub === parcel1.userID
  ) {
    await prisma.workGalleryPicture.create({
      data: { user_ID: parcel1.userID, pictureID: parcel1.id! },
    });
    const workgallery = await prisma.workGalleryPicture.findMany({
      where: { user_ID: parcel1.userID },
    });
    return NextResponse.json(workgallery);
  }
  if (
    parcel1.method === "removeworkgalleryPic" &&
    session.user.sub === parcel1.userID
  ) {
    await prisma.workGalleryPicture.delete({
      where: { id: parcel1.id, user_ID: parcel1.userID },
    });

    const workgallery = await prisma.workGalleryPicture.findMany({
      where: { user_ID: parcel1.userID },
    });

    return NextResponse.json(workgallery);
  }

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
          number_of_applications: { lte: 3 },
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
          postalCode: true,
        },
      })) as submitted_job_SANS_Email[];

      let distanceParcel1: distanceParcel = {
        radius: parcel1.radius!,
        lat: parcel1.lat!,
        long: parcel1.long!,
        JobsArray: submitted_jobs,
      };

      const result = await axios
        .post(process.env.NEXT_PUBLIC_HaversinEndpoint!, distanceParcel1)
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

      await prisma.submitted_job.update({
        where: { id: parcel1.leadID },
        data: {
          number_of_applications:
            JobThatIsBeingAppliedTo?.number_of_applications! + 1,
        },
      });

      await prisma.appliedJob.create({
        data: {
          submittedJob_ID: parcel1.leadID!,
          submitterEmail: JobThatIsBeingAppliedTo?.submittterEmail!,
          status: "CONTACTED",
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
      orderBy: { dateCreated: "desc" },
    });

    return NextResponse.json(AppliedJobs);
  }

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
          // submittterEmail : parcel1.email
        },
      });
      if (parcel1.pictures?.length! > 0) {
        for (let i: number = 0; i < parcel1.pictures?.length!; i++) {
          await prisma.jobPicture.create({
            data: {
              pictureID: parcel1.pictures![i],
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
        },
      });
      if (parcel1.pictures?.length! > 0) {
        for (let i: number = 0; i < parcel1.pictures?.length!; i++) {
          await prisma.jobPicture.create({
            data: {
              pictureID: parcel1.pictures![i],
              submitted_jobId: subjob1.id,
            },
          });
        }
      }
      if (parcel1.method === "CREATEACCOUNT") {
        const hashedpassword = await bcrypt.hash(parcel1.password!, 10);

        await prisma.user.create({
          data: {
            email: parcel1.email!,
            password: hashedpassword,
            role: "USER",
            phoneNum: parcel1.phonenum!,
            name: parcel1.name!,
          },
        });
      }
      break;
  }

  return NextResponse.json({ email: "newuser.email" });
}
