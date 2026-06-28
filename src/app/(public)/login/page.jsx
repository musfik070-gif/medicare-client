"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUserAPI } from "../../../services/auth/authService";
import { authClient } from "../../../lib/auth-client";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    if (!email || !password) {
      setError("Please fill in both email and password.");
      setLoading(false);
      return;
    }

    // Call the backend API
    const credentials = { email, password };
    const response = await loginUserAPI(credentials);

    if (response.success) {
      setSuccess("Login successful! Redirecting...");

      // Save the VIP pass (Token) and User data to browser storage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect user to the home page
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setError(response.message || "Invalid credentials.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("google_success") === "true") {
        setLoading(true);
        setError("");
        setSuccess("Authenticating with Google...");
        try {
          const { data, error: sessionErr } = await authClient.getSession();
          if (sessionErr || !data) {
            setError("Failed to retrieve Google session.");
            setLoading(false);
            return;
          }

          // Exchange Better Auth session for the JWT token
          const serverUrl =
            process.env.NEXT_PUBLIC_API_URL ||
            process.env.NEXT_PUBLIC_SERVER_URL ||
            "http://localhost:5001";
          const authUrl = serverUrl.endsWith("/api/auth")
            ? serverUrl
            : `${serverUrl.replace(/\/$/, "")}/api/auth`;
          const response = await fetch(`${authUrl}/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: data.user.name,
              email: data.user.email,
              photoURL: data.user.image || "",
            }),
          });

          const result = await response.json();
          if (result.success) {
            setSuccess("Google login successful! Redirecting...");
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            setTimeout(() => {
              router.push("/");
            }, 1500);
          } else {
            setError(result.message || "Failed to log in with Google.");
          }
        } catch (err) {
          console.error("Callback verification failed:", err);
          setError("An error occurred during Google sign-in verification.");
        }
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [router]);

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/login?google_success=true",
      });
    } catch (err) {
      console.error("Google Login Error:", err);
      setError("Failed to initiate Google login.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300">
        <div className="card-body p-8">
          <h2 className="text-3xl font-extrabold text-center mb-2 text-primary">Login</h2>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="******"
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            {/* Error and Success Messages */}
            {error && <p className="alert alert-error py-2 text-sm mt-2">{error}</p>}
            {success && (
              <p className="alert alert-success py-2 text-sm mt-2">{success}</p>
            )}

            {/* Submit Button */}
            <div className="form-control pt-2">
              <button
                type="submit"
                className="btn btn-primary w-full shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Login with Email"
                )}
              </button>
            </div>
          </form>

          <div className="divider text-base-content/50">OR</div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline btn-secondary w-full"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5 mr-2"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center mt-4 text-sm text-base-content/70">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
