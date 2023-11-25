import { NextApiRequest, NextApiResponse } from "next";
import ytsr from "ytsr";
import { UserLib } from "../../lib/user";
import { KeyLib } from "../../lib/key";
import { getSeconds } from "../../lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { auth, query, limit } = req.query as {
      auth: string;
      query: string;
      limit: string;
    };

    if (!auth) {
      return res.status(401).json({ error: "Unauthorized: auth is required" });
    }

    if (!query || Array.isArray(query)) {
      return res.status(400).json({ error: "query is required" });
    }

    const key = KeyLib.encrypt(auth);
    const user = await UserLib.getUserByKey(key);

    if (!user || !user.active) {
      return res
        .status(401)
        .json({ error: "Unauthorized: key invalid or not active" });
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const limitInt = parseInt(limit, 10) || 1;

    if (limitInt <= 0) {
      return res
        .status(400)
        .json({ error: "Limit must be a positive integer" });
    }

    const filters = await ytsr.getFilters(query);
    const filter = filters.get("Type")?.get("Video");

    if (!filter) {
      return res.status(400).json({ error: "No video results found" });
    }

    const searchResults = await ytsr(filter.url as string, { limit: limitInt });

    if (!searchResults || searchResults.items.length === 0) {
      return res.status(400).json({ error: "No video results found" });
    }

    const items = searchResults.items
      .filter((item: any) => item.type === "video" && item.duration !== null)
      .map((item: any) => ({
        videoID: item.id,
        title: item.title,
        artist: item.author.name,
        duration: getSeconds(item.duration || "00:00:00"),
        thumbnail: item.bestThumbnail.url,
        streamLink: `${req.headers["x-forwarded-proto"]}://${req.headers["x-forwarded-host"]}/api/stream/?auth=${auth}&videoId=${item.id}`,
      }));

    res.json({
      success: true,
      data: {
        items,
      },
    });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
