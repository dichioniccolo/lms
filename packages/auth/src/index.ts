import type { JWT } from "@auth/core/jwt";
import type { DefaultSession } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";

import { db, eq, schema } from "@acme/db";
import { inngest } from "@acme/inngest";

export type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update: updateSession,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    // Discord({
    //   allowDangerousEmailAccountLinking: true,
    // }),
    {
      id: "email",
      type: "email",
      name: "Email",
      server: { host: "", port: 0, auth: { user: "", pass: "" } },
      from: "",
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier, url }) {
        await inngest.send({
          name: "user/login-link",
          data: {
            email: identifier,
            url,
          },
        });
      },
      options: {},
    },
  ],
  callbacks: {
    // signIn: async ({ account, profile }) => {

    //   return true;
    // },
    session: ({ session, ...others }) => {
      if ("token" in others) {
        session.user.id = others.token.sub!;
        session.user.name = others.token.name;
        session.user.email = others.token.email!;
        session.user.image = others.token.picture;
      }

      return session;
    },

    jwt: async ({ token, user }) => {
      if (!token.email) {
        throw new Error("Unable to sign in with this email address");
      }

      const dbUser = await db.query.users.findFirst({
        where: eq(schema.users.email, token.email),
        columns: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      });

      if (!dbUser) {
        if (user) {
          token.sub = user?.id;
        }

        return token;
      }

      return {
        sub: dbUser.id,
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        picture: dbUser.image,
      } as JWT;
    },
  },
});
