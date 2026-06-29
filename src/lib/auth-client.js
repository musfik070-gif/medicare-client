import { createAuthClient } from "better-auth/react";
import { SERVER_URL } from "./api";

export const authClient = createAuthClient({
  baseURL: SERVER_URL.endsWith("/api/auth")
    ? SERVER_URL
    : `${SERVER_URL.replace(/\/$/, "")}/api/auth`,
});
