import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { parcel, MobileSession } from "@/projecttypes";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parcel1: parcel = body;
  console.log("phonelogin");
  console.log(parcel1);

  const foundUser = await prisma.user.findUnique({
    where: {
      email: parcel1.email,
    },
  });

  if (foundUser) {
    console.log("User Exists");
    console.log(foundUser);
    const match = await bcrypt.compare(parcel1.password!, foundUser.password);

    if (match) {
      console.log("Good Pass");
      foundUser.password = " ";

      let sesh: MobileSession = {
        user: {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
          isClient: foundUser.isClient,
          isRepairman: foundUser.isRepairman,
          isAdmin: foundUser.isAdmin,
          sub: foundUser.id,
        },
      };
      const secretKey = process.env.NEXTAUTH_SECRET as Secret | undefined;

      if (!secretKey) {
        throw new Error(
          "NEXTAUTH_SECRET is not defined in the environment variables."
        );
      }

      const token = jwt.sign(sesh, secretKey);

      console.log(token);

      const reqtoken = jwt.decode(token);
      console.log(reqtoken);
      sesh.user.token = token;

      return NextResponse.json(sesh);
    }
  }

  return NextResponse.json({ email: "newuser.email" });
}
