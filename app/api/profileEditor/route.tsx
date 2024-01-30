import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import axios from "axios";
import { parcel } from "@/projecttypes";
import { category, sub_category } from "@prisma/client";
import { authOptions } from "../auth/authOptions";
import { Session, getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session;
  const body = await req.json();
  const parcel1: parcel = body;

  if (session) {
    if (parcel1.method === "getLocation") {
      const stuffToEdit = await prisma.user.findFirst({
        where: { id: session.user.sub },

        select: {
          coins: true,
          TravelRange: true,
          latitude: true,
          longitude: true,
        },
      });

      return NextResponse.json(stuffToEdit);
    }
    if (parcel1.method === "getLocation") {
      const stuffToEdit = await prisma.user.findFirst({
        where: { id: session.user.sub },

        select: {
          coins: true,
          TravelRange: true,
          latitude: true,
          longitude: true,
        },
      });

      return NextResponse.json(stuffToEdit);
    }
    if (parcel1.method === "getLocation") {
      const stuffToEdit = await prisma.user.findFirst({
        where: { id: session.user.sub },

        select: {
          coins: true,
          TravelRange: true,
          latitude: true,
          longitude: true,
        },
      });

      return NextResponse.json(stuffToEdit);
    }
    if (parcel1.method === "getLocation") {
      const stuffToEdit = await prisma.user.findFirst({
        where: { id: session.user.sub },

        select: {
          coins: true,
          TravelRange: true,
          latitude: true,
          longitude: true,
        },
      });

      return NextResponse.json(stuffToEdit);
    }
    if (parcel1.method === "getLocation") {
      const stuffToEdit = await prisma.user.findFirst({
        where: { id: session.user.sub },

        select: {
          coins: true,
          TravelRange: true,
          latitude: true,
          longitude: true,
        },
      });

      return NextResponse.json(stuffToEdit);
    }
    if (parcel1.method === "getLocation") {
      const stuffToEdit = await prisma.user.findFirst({
        where: { id: session.user.sub },

        select: {
          coins: true,
          TravelRange: true,
          latitude: true,
          longitude: true,
        },
      });

      return NextResponse.json(stuffToEdit);
    }
  }
}
