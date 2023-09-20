import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib";
import { ENV, PAGES } from "@/constants";
import { UserRole } from "@/types";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: ENV.GITHUB_CLIENT_ID,
      clientSecret: ENV.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) throw new Error("Missing email");

      const [fallback] = user.email.split("@");

      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name || fallback,
          email: user.email,
          image: user.image || null,
        },
        create: {
          name: user.name || fallback,
          email: user.email,
          image: user.image || null,
          role: UserRole.USER,
        },
      });

      return true;
    },
  },
  pages: {
    signIn: PAGES.SIGN_IN,
    error: PAGES.SIGN_IN,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
