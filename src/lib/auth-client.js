import { createAuthClient } from "better-auth/react";
import { SERVER_URL } from "./api";

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
  fetchOptions: {
    credentials: "include"
  }
});
