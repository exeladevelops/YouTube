import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { UserLib } from "../../../lib/user";
import { KeyLib } from "../../../lib/key";
import rateLimit from "../../../lib/rate-limit";

const generalLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 120, // Max 120 users per second
});

const apiKeyRegenerationLimiter = rateLimit({
  interval: 60 * 60 * 1000 * 3, // Once per 3 hours
  uniqueTokenPerInterval: 1, // Max 1 regeneration per hour
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Forbidden" });
  }

  try {
    await generalLimiter.check(
      res,
      30,
      session.user?.email?.replace("@steamcommunity.com", "") as string,
    ); // 30 requests per minute
  } catch {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  const { steamid } = req.query;
  if (!steamid || typeof steamid !== "string" || !/^[0-9]{17}$/.test(steamid)) {
    return res
      .status(400)
      .json({ error: "SteamID is required and must be in the correct format" });
  }

  const user = await new UserLib(steamid).getUser();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (
    session.user?.email?.replace("@steamcommunity.com", "") !== user.steamid
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "GET") {
    return res
      .status(200)
      .json({ ...user, apiKey: KeyLib.decrypt(user.apiKey) });
  } else if (req.method === "PUT") {
    try {
      await apiKeyRegenerationLimiter.check(
        res,
        2,
        session.user?.email?.replace("@steamcommunity.com", "") as string,
      );
    } catch {
      return res
        .status(429)
        .json({ error: "API key regeneration rate limit exceeded" });
    }

    const newApiKey = await new UserLib(steamid).regenerateApiKey();
    return res.status(200).json({ apiKey: KeyLib.decrypt(newApiKey) });
  }

  return res.status(405).json({ error: "Method not allowed, use GET or PUT." });
}
