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
  const session:Session = (await getServerSession(authOptions)) as Session;
  const body = await req.json();
  const parcel1: parcel = body;
  // console.log("alttrpc");
  // console.log(parcel1);


  if (parcel1.method === "getSingularJob") {
    if (session.user.sub === parcel1.userID) {
      const subjob = await prisma.submitted_job.findFirst({
        where: { id: parcel1.SubmittedJobID },
        include: { pictures: true },
      });
      return NextResponse.json(subjob);
    }
  }
  
  return NextResponse.json({ email: "newuser.email" });
}
