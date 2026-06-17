import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { upsertUser, getUserByEmail } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await upsertUser(user.email, user.name ?? undefined, user.image ?? undefined);
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await getUserByEmail(session.user.email);
        session.user.isPro = dbUser?.is_pro ?? false;
        session.user.id = dbUser?.id ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
