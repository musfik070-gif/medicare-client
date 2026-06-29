export const SERVER_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5001";

export const API_BASE_URL = `${SERVER_URL.replace(/\/$/, "")}/api`;
