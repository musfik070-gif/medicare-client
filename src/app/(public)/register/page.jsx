"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Import Next.js router
import { registerUserAPI } from "../../../services/auth/authService"; // 2. Import our API service

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state
  const router = useRouter(); // Initialize router

  const handleRegister = async (e) => {
    // 3. Make this function async
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photoURL = form.photoURL.value;
    const password = form.password.value;

    // Strict Password Validation
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters long and include at least one number and one special character.",
      );
      setLoading(false);
      return;
    }

    // 4. Package data and call the backend API
    const userData = { name, email, photoURL, password };
    const response = await registerUserAPI(userData);

    if (response.success) {
      setSuccess("Registration successful! Redirecting to login...");
      form.reset(); // Clear the form

      // 5. Redirect the user after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      // Show error from backend (e.g., "User already exists")
      setError(response.message || "Registration failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 w-full max-w-md">
        <form onSubmit={handleRegister} className="space-y-3">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center mb-6">
            Create Account
          </h2>

          {/* Name Field */}
          <div className="form-control">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              <span>Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Photo URL Field */}
          <div className="form-control">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              <span>Photo URL</span>
            </label>
            <input
              type="url"
              name="photoURL"
              placeholder="https://example.com/photo.jpg"
              className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              <span>Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="******"
              className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Error and Success Messages */}
          {error && <p className="alert alert-error py-2 text-sm mt-2">{error}</p>}
          {success && <p className="alert alert-success py-2 text-sm mt-2">{success}</p>}

          {/* Submit Button */}
          <div className="form-control pt-3">
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg py-3 font-medium transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Register"
              )}
            </button>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-sky-500 hover:text-sky-600 font-medium"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
