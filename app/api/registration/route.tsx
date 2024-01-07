import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { userNotificationConfig } from "@prisma/client";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

// interface registerPayload {
//   email: string;
//   password: string;
// }

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = schema.safeParse(body);
  if (!validation) {
    return NextResponse.json(validation, {
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (user) {
    return NextResponse.json({ error: "user already exists" }, { status: 400 });
  }

  const hashedpassword = await bcrypt.hash(body.password, 10);

  const newuser = await prisma.user.create({
    data: {
      email: body.email,
      password: hashedpassword,
      role: body.role,
      phoneNum: body.phoneNum,
      name: body.name,
    },
  });
  const userconfig = await prisma.userNotificationConfig.create({
    data: {
      name: newuser.name,
      userId: newuser.id,
    },
  });

  return NextResponse.json({ name: newuser.name });
}
