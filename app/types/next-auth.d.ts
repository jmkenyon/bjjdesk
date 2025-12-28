import  { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      gymId: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    gymId: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string;
    gymId: string;
    role: string;
  }
}