import { NextApiRequest, NextApiResponse } from "next";
import { UserLib } from "../../../lib/user";
import { KeyLib } from "../../../lib/key";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Input validation
    const { key } = req.query;
    if (!key || typeof key !== "string") {
      return res.status(400).json({ success: false, error: "Invalid key parameter" });
    }

    const encryptedKey = KeyLib.encrypt(key);

    // Fetch user
    const user = await UserLib.getUserByKey(encryptedKey);

    if (!user) {
      return res.status(404).json({ success: true, valid: false });
    }

    // Success response
    return res.status(200).json({ success: true, valid: true, steamid: user.steamid });
  } catch (error) {
    console.error("Error in API:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
