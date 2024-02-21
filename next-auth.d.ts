// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultSession } from "next-auth";
// import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      isClient: boolean;
      isRepairman: boolean;
      isAdmin: boolean;
      sub: string;
    } & DefaultSession["user"];
  }
}
