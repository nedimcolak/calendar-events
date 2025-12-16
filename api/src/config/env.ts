import dotenv from "dotenv";

dotenv.config();

export const env = {
  node: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  database: {
    url: process.env.DATABASE_URL || "",
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI || "",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret",
    expiry: process.env.JWT_EXPIRY || "7d",
  },

  session: {
    secret: process.env.SESSION_SECRET || "session-secret",
  },
};

// Validate required env vars
const requiredEnvVars = ["DATABASE_URL", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI"];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
