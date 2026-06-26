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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300">
        <form onSubmit={handleRegister} className="card-body p-8 space-y-3">
          <h2 className="text-3xl font-extrabold text-center mb-2 text-primary">
            Create Account
          </h2>

          {/* Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="input input-bordered w-full focus:input-primary"
              required
            />
          </div>

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

          {/* Photo URL Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Photo URL</span>
            </label>
            <input
              type="url"
              name="photoURL"
              placeholder="https://example.com/photo.jpg"
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
          {success && <p className="alert alert-success py-2 text-sm mt-2">{success}</p>}

          {/* Submit Button */}
          <div className="form-control pt-3">
            <button
              type="submit"
              className="btn btn-primary w-full shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Register"
              )}
            </button>
          </div>

          <p className="text-center mt-4 text-sm text-base-content/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
