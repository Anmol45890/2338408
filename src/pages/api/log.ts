import type { NextApiRequest, NextApiResponse } from "next";

// Import the CommonJS logger module from the project root
const Log = require("../../../logger");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { stack, level, package: packageName, message } = req.body;

  if (!stack || !level || !packageName || !message) {
    return res.status(400).json({ message: "Missing required logging fields" });
  }

  try {
    // Call the original logger middleware
    await Log(stack, level, packageName, message);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Local logger route error:", err.message);
    return res.status(500).json({ message: "Failed to submit log", error: err.message });
  }
}
