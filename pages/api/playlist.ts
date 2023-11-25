import { NextApiRequest, NextApiResponse } from "next";
import ytpl from "ytpl";
import { UserLib } from "../../lib/user";
import { KeyLib } from "../../lib/key";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { auth, playlistId } = req.query as {
      auth: string;
      playlistId: string;
    };

    if (!auth) {
      return res.status(401).json({ error: "Unauthorized: auth is required" });
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

    if (!playlistId || Array.isArray(playlistId)) {
      return res
        .status(400)
        .json({ success: false, error: "playlistId is required" });
    }

    const modifiedPlaylistId = playlistId.replace("|", "&");

    const playlist = await ytpl(modifiedPlaylistId);
    if (!playlist) {
      return res
        .status(400)
        .json({ success: false, error: "No results found" });
    }

    const items = playlist.items.map((item: any) => ({
      videoID: item.id,
      title: item.title,
      artist: item.author.name,
      duration: item.durationSec,
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
