import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json({
    success: true,
    version: "v1.0.0-stable",
  });
}
