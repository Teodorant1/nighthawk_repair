import CredentialsProvider from "next-auth/providers/credentials";
import { user } from "@prisma/client";
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
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token, user }: any) {
      // console.log("sesh callback", { token, user, session });
      if (session?.user) session.user.role = token.role;
      return session;
    },
  },
};

// import prisma from "@/prisma/client";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "email",
//           placeholder: "Email",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//           placeholder: "Password",
//         },
//       },

//       async authorize(credentials, req) {
//         if (!credentials?.email || !credentials.password) return null;

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) return null;

//         const passwordsMatch = await bcrypt.compare(
//           credentials.password,
//           user.password!
//         );

//         return passwordsMatch ? user : null;
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
// };
