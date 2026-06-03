import axios from "axios";
import { LogRequest } from "../types";

export function useLogs() {
  const log = async (
    stack: string,
    level: LogRequest["level"],
    packageName: string,
    message: string
  ) => {
    try {
      // Post to our local API route proxy which forwards to logger.js
      await axios.post("/api/log", {
        stack,
        level,
        package: packageName,
        message,
      } as LogRequest);
    } catch (err) {
      // Suppress/fallback console error so app doesn't crash if logging fails
      console.warn("Logging middleware proxy failed:", err);
    }
  };

  return { log };
}
