import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        const email = normalizeEmail(credentials?.email);

        if (!emailPattern.test(email)) {
          return null;
        }

        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: email.split("@")[0]
          }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id;
      }

      return session;
    }
  }
});
