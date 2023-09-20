import { prisma } from "../lib";
import { ENV } from "../constants";
import { UserRole } from "../types";

async function main() {
  await prisma.user.upsert({
    where: { email: ENV.ROOT_USER_EMAIL },
    create: {
      email: ENV.ROOT_USER_EMAIL,
      name: ENV.ROOT_USER_NAME,
      role: UserRole.ADMIN,
    },
    update: {
      name: ENV.ROOT_USER_NAME,
      role: UserRole.ADMIN,
    },
  });
}

main().finally(async () => await prisma.$disconnect());
