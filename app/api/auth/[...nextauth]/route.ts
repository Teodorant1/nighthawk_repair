import NextAuth from "next-auth";
import { authOptions } from "../authOptions";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/prisma/client";

export const authOptions1 = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
          placeholder: "your-email",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "your-password",
        },
      },
      async authorize(credentials) {
        try {
          const foundUser = await prisma.user.findUnique({
            where: { email: credentials!.email },
          });

          if (foundUser) {
            console.log("User Exists");
            const match = await bcrypt.compare(
              credentials!.password,
              foundUser.password
            );

            if (match) {
              console.log("Good Pass");
              foundUser.password = " ";

              // foundUser["role"] = "Unverified Email";
              return foundUser;
            }
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
