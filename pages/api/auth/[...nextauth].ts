import type { AuthOptions } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User, Account, Profile } from "next-auth";

import NextAuth from "next-auth";
import SteamProvider from "next-auth-steam";
import { UserLib } from "../../../lib/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return NextAuth(req, res, {
    providers: [
      SteamProvider(req, {
        clientSecret: process.env.STEAMAPIKEY as string,
        callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/steam`,
      }),
    ],
    secret: process.env.SECRET as string,
    cookies: {
      sessionToken: {
        name: "next-auth.session-token",
        options: {
          httpOnly: true,
          path: "/",
          secure: true,
        },
      },
    },
    callbacks: {
      async signIn(params: {
        user: User | null;
        account: Account | null;
        profile: Profile;
      }) {
        const steamId = params.user?.id;
        if (!steamId) return false;
        const user = await new UserLib(steamId);

        const existingUser = await user.getUser();
        if (!existingUser || !existingUser.apiKey) {
          await UserLib.createUser(steamId);
        }
        return true;
      },
    },
  } as AuthOptions);
}
