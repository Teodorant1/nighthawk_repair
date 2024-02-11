import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/authOptions";
import { Session, getServerSession } from "next-auth";
import prisma from "@/prisma/client";
import { distanceParcel, submitted_job_SANS_Email } from "@/projecttypes";
import axios from "axios";

export const t = initTRPC.create();
interface user {
  name: string;
  role: string;
}

export const appRouter = t.router({
  getAggregatedJobsForUser: t.procedure
    .input(
      z.object({
        userID: z.string(),
      })
    )
    .query(async (opts) => {
      const session = (await getServerSession(authOptions)) as Session;

      if (session.user.sub === opts.input.userID) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let aggregatedResults: submitted_job_SANS_Email[] = [];
        const criteriaList = await prisma.profileSubCategory.findMany({
          where: {
            user_ID: opts.input.userID,
          },
        });

        // console.log("interests");
        // console.log(criteriaList);

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
              },
              // Add other options if needed (e.g., select, orderBy, etc.)
            });

            let result = result1 as submitted_job_SANS_Email[];

            // console.log("criteria Result");
            // console.log(result);

            // Aggregate results into the array
            aggregatedResults = aggregatedResults.concat(result);
          } catch (error) {
            console.error(`Error fetching data: ${error}`);
          }
        }
        // console.log("aggregatedResults");
        // console.log(aggregatedResults);

        const currentuser = await prisma.user.findFirst({
          where: {
            id: session.user.sub,
          },
        });

        console.log("currentuser");
        console.log(currentuser);

        let distanceParcel1: distanceParcel = {
          radius: Number(currentuser?.TravelRange!),
          lat: Number(currentuser?.latitude!),
          long: Number(currentuser?.longitude!),
          JobsArray: aggregatedResults,
        };

        console.log("distanceParcel1");
        console.log(distanceParcel1);

        const result = await axios
          .post("http://localhost:8001/", distanceParcel1)
          .then((resp) => {
            console.log("finalresult");

            console.log(resp.data);
            return resp.data as submitted_job_SANS_Email[];
          })
          .catch((error) => console.log(error));
        //  return NextResponse.json(submitted_jobs);
        //  return NextResponse.json(result);
        return result;
      }
    }),
  getSingularJob: t.procedure
    .input(
      z.object({
        SubmittedJobID: z.string(),
        userID: z.string(),
      })
    )
    .query(async (opts) => {
      const session = (await getServerSession(authOptions)) as Session;

      if (session.user.sub === opts.input.userID) {
        const subjob = await prisma.submitted_job.findFirst({
          where: { id: opts.input.SubmittedJobID },
          include: { pictures: true },
        });

        return subjob;
      }
    }),
  tag_Applied_Job: t.procedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
        userID: z.string(),
      })
    )
    .mutation(async (opts) => {
      const session = (await getServerSession(authOptions)) as Session;
      console.log(opts.input.id);
      console.log;
      if (session.user.sub === opts.input.userID) {
        const newappliedjob = await prisma.appliedJob.update({
          where: { id: opts.input.id },
          data: {
            status: opts.input.status,
          },
        });

        return newappliedjob;
      }
    }),
  GetBuyerJoblist: t.procedure
    .input(
      z.object({
        submitterEmail: z.string(),
        userID: z.string(),
      })
    )
    .query(async (opts) => {
      const session = (await getServerSession(authOptions)) as Session;

      if (session.user.sub === opts.input.userID) {
        const buyerjoblist = await prisma.submitted_job.findMany({
          where: { submittterEmail: opts.input.submitterEmail },
          include: { pictures: true },
          orderBy: { date_created: "desc" },
        });

        return buyerjoblist;
      }
    }),
  GetBuyerJobApplications: t.procedure
    .input(
      z.object({
        SubmittedJobID: z.string(),
        userID: z.string(),
      })
    )
    .query(async (opts) => {
      const session = (await getServerSession(authOptions)) as Session;

      if (session.user.sub === opts.input.userID) {
        const subjob_applications = await prisma.appliedJob.findMany({
          where: { submittedJob_ID: opts.input.SubmittedJobID },
          select: {
            id: true,
            submittedJob_ID: true,
            submitterEmail: true,
            // status: false,
            userID: true,
          },
        });

        return subjob_applications;
      }
    }),
  getAllSubcategories: t.procedure.query(async (opts) => {
    const subcategories = await prisma.sub_category.findMany();

    return subcategories;
  }),
  ToggleJobVisibility: t.procedure
    .input(
      z.object({
        userID: z.string(),
        SubmittedJobID: z.string(),
        submitterEmail: z.string(),
        visibility: z.boolean(),
      })
    )
    .mutation(async (opts) => {
      const session = (await getServerSession(authOptions)) as Session;
      if (session.user.sub === opts.input.userID) {
        await prisma.submitted_job.update({
          where: {
            submittterEmail: opts.input.submitterEmail,
            id: opts.input.SubmittedJobID,
          },
          data: { isVisible: opts.input.visibility },
        });

        return null;
      }
    }),
  MarkJobAs: t.procedure
    .input(
      z.object({
        userID: z.string(),
        status: z.string(),
        SubmittedJobID: z.string(),
        submitterEmail: z.string(),
      })
    )
    .mutation(async (opts) => {
      const session = (await getServerSession(authOptions)) as Session;

      let user: user = {
        name: opts.input.submitterEmail,
        role: "ADMIN",
      };

      return user;
    }),
  procedureeeeeeeeeeee: t.procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async (opts) => {
      const session = (await getServerSession(authOptions)) as Session;

      let user: user = {
        name: opts.input.name,
        role: "ADMIN",
      };

      return user;
    }),
});

export const trpc = t;
