import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import { UserLib } from "../../lib/user";
import { KeyLib } from "../../lib/key";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { auth, videoId, extended } = req.query as {
      auth: string;
      videoId: string;
      extended?: string;
    };

    // Validate auth and fetch user
    const key = KeyLib.encrypt(auth);
    const user = await UserLib.getUserByKey(key);

    if (!auth || !videoId || Array.isArray(videoId)) {
      return res.status(400).json({
        success: false,
        error: "auth and videoId are required",
      });
    }

    if (!user || !user.active) {
      return res.status(401).json({ error: "Unauthorized: key invalid or not active" });
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Validate video ID
    const id = await ytdl.getVideoID(videoId);

    if (!id || !ytdl.validateID(id)) {
      return res.status(400).json({
        success: false,
        error: "id is required and must be a valid video ID or URL.",
      });
    }

    if (extended) {
      // Fetch extended info
      const info = await ytdl.getBasicInfo(id);
      return res.json({
        success: true,
        data: {
          title: info.videoDetails.title,
          artist: info.videoDetails.author.name,
          duration: info.videoDetails.lengthSeconds,
          thumbnail: info.videoDetails.thumbnails[0].url,
          streamLink: `${req.headers["x-forwarded-proto"]}://${req.headers["x-forwarded-host"]}/api/stream/?auth=${auth}&videoId=${videoId}`,
        },
      });
    }

    // Fetch video info
    const videoInfo = await ytdl.getInfo(id);

    // Choose the best audio format
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, {
      quality: "highestaudio",
      filter: (format) => format.container === "mp4",
    });

    if (!audioFormat) {
      return res.status(500).json({ error: "No audio format found" });
    }

    // Set headers for audio streaming
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `inline; filename="${id}.mp3"`);

    // Use Fluent-ffmpeg to process the audio
    const ffmpegCommand = ffmpeg();
    ffmpegCommand.input(ytdl(id, { format: audioFormat }))
      .audioCodec("libmp3lame")
      .audioBitrate(192)
      .format("mp3");

    // Pipe the output to the response stream
    await new Promise((resolve, reject) => {
      ffmpegCommand
        .on("error", (error) => {
          reject(error);
        })
        .on("end", () => {
          Promise.resolve();
        })
        .pipe(res, { end: true });
    });

    // End the response stream
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, error: `${error}` });
  }
}
