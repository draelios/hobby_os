import { prisma } from "./prisma";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export async function getCurrentUserId() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/login");
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: session.user.name || email.split("@")[0]
    },
    select: { id: true }
  });

  return user.id;
}
