import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json({
    success: true,
    version: "BETA 0.0.1",
  });
}
