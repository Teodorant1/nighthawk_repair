import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/prisma/client";

export const authOptions = {
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
  callbacks: {
    async jwt({ token, user, session }: any) {
      // console.log("jwt callback", { token, user, session });
      if (user) {
        token.role = user.role;
        token.isClient = user.isClient;
        token.isAdmin = user.isAdmin;
        token.isRepairman = user.isRepairman;
      }
      return token;
    },
    async session({ session, token, user }: any) {
      // console.log("sesh callback", { token, user, session });
      if (session?.user) {
        session.user.role = token.role;
        session.user.isClient = token.isClient;
        session.user.isAdmin = token.isAdmin;
        session.user.isRepairman = token.isRepairman;
      }
      return session;
    },
  },
};
