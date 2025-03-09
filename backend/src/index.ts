// server.ts
import dotenv from "dotenv";
dotenv.config();

import { httpServer } from "../app";
import { logger } from "../utils/logger";

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});
