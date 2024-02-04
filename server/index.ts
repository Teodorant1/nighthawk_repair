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
    .mutation(async (opts) => {
      const session = (await getServerSession(authOptions)) as Session;

      if (session.user.sub === opts.input.userID) {
        let aggregatedResults: submitted_job_SANS_Email[] = [];
        const criteriaList = await prisma.profileSubCategory.findMany({
          where: {
            user_ID: opts.input.userID,
          },
        });

        for (const criteria of criteriaList) {
          try {
            const result = (await prisma.submitted_job.findMany({
              orderBy: [
                {
                  date_created: "desc",
                },
              ],
              where: {
                sub_categoryID: criteria.subcategory,
                categoryID: criteria.category,
              },
              select: {
                submittterEmail: false,
              },
              // Add other options if needed (e.g., select, orderBy, etc.)
            })) as submitted_job_SANS_Email[];

            // Aggregate results into the array
            aggregatedResults = aggregatedResults.concat(result);
          } catch (error) {
            console.error(`Error fetching data: ${error}`);
          }
        }

        const currentuser = await prisma.user.findFirst({
          where: {
            id: session.user.id,
          },
        });

        let distanceParcel1: distanceParcel = {
          radius: currentuser?.TravelRange!,
          lat: Number(currentuser?.latitude!),
          long: Number(currentuser?.longitude!),
          JobsArray: aggregatedResults,
        };
        const result = await axios
          .post("http://localhost:8001/", distanceParcel1)
          .then((resp) => {
            return resp.data as submitted_job_SANS_Email[];
          })
          .catch((error) => console.log(error));
        //  return NextResponse.json(submitted_jobs);
        //  return NextResponse.json(result);
        return result;
      }
    }),

  procedureeeeeeeeeeee: t.procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async (opts) => {
      const session = (await getServerSession(authOptions)) as Session;
      console.log(opts.input.name);
      console.log;

      let user: user = {
        name: opts.input.name,
        role: "ADMIN",
      };

      return {
        user,
      };
    }),
});

export const trpc = t;
