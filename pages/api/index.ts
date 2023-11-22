import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const routes = {
      "/api/stream/": {
        description: "Takes a video id or URL and returns an audio stream",
        auth: { type: "string", required: true },
        videoId: { type: "string", required: true },
        extended: { type: "boolean", optional: true },
      },
      "/api/playlist": {
        description:
          "Takes a playlist id and returns an array of videos in the playlist",
        auth: { type: "string", required: true },
        playlistId: { type: "string", required: true },
      },
      "/api/search": {
        description:
          "Takes a query and returns the information of the first (x) results",
        auth: { type: "string", required: true },
        query: { type: "string", required: true },
        limit: { type: "integer", optional: true, default: 1 },
      },
      "/api/validate-key/:key": {
        description: "Validates a key and returns user information"
      },
      "/api/e2": {
        description:
          "Returns information about the latest expression 2 build",
      },
    };

    res.json({
      success: true,
      version: "1.0.0",
      routes,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
