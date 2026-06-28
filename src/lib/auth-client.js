import { createAuthClient } from "better-auth/react";

const serverURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5001";

export const authClient = createAuthClient({
  baseURL: serverURL.endsWith("/api/auth")
    ? serverURL
    : `${serverURL.replace(/\/$/, "")}/api/auth`,
});
