const API_BASE_URL = "http://localhost:5001/api/auth"; // Make sure 5001 matches your server port!

// Call backend to register a new user
export const registerUserAPI = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    return await response.json();
  } catch (error) {
    console.error("Login Service Error:", error);
    return { success: false, message: "Network error occurred." };
  }
};
