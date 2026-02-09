import { prisma } from "./prisma";

const DEFAULT_USER_EMAIL = "owner@hobbies.local";

export async function getCurrentUserId() {
  const user = await prisma.user.upsert({
    where: { email: DEFAULT_USER_EMAIL },
    update: {},
    create: {
      email: DEFAULT_USER_EMAIL,
      name: "Owner"
    },
    select: { id: true }
  });

  return user.id;
}
