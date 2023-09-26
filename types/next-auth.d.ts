import { JWT } from "next-auth/jwt";

import { UserStatus, UserRole } from "@/types";

declare module "next-auth/jwt" {
  interface JWT {
    status: UserStatus;
    role: UserRole;
  }
}
