import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { parcel } from "@/projecttypes";
import { category } from "@prisma/client";
import { authOptions } from "../auth/authOptions";
import { Session, getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session;
  const body = await req.json();
  const parcel1: parcel = body;

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
    // console.log("parcel1.radius");
    // console.log(parcel1.radius);
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
      select: { id: true, name: true, categoryID: true, questions: false },
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
      data: { user_ID: parcel1.userID, cloudinaryID: parcel1.id! },
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
}
