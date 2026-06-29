import { API_BASE_URL } from "@/src/lib/api";

const AUTH_API_URL = `${API_BASE_URL}/auth`;

// Call backend to register a new user
export const registerUserAPI = async (userData) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error("Registration Service Error:", error);
    return { success: false, message: "Network error occurred." };
  }
};

// Call backend to login an existing user
export const loginUserAPI = async (credentials) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    return await response.json();
  } catch (error) {
    console.error("Login Service Error:", error);
    return { success: false, message: "Network error occurred." };
  }
};
