const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export const wakeUpServer = async () => {
  try {
    await fetch(`${BACKEND_URL}/ping`, {
      method: "GET",
      cache: "no-store"
    });
    console.log("Server is awake");
  } catch (err) {
    console.log("Wakeup ping failed:", err);
  }
};
