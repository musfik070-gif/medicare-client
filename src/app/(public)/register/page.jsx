"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photoURL = form.photoURL.value;
    const password = form.password.value;

    // Strict Password Validation from Requirement Doc
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters long and include at least one number and one special character.",
      );
      return;
    }

    // If validation passes, we will handle the actual registration later
    console.log("Form Data:", { name, email, photoURL, password });
    setSuccess("Validation passed! Ready to connect to backend.");
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <form onSubmit={handleRegister} className="card-body">
          <h2 className="text-3xl font-bold text-center mb-4">
            Create Account
          </h2>

          {/* Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="input input-bordered"
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              className="input input-bordered"
              required
            />
          </div>

          {/* Photo URL Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Photo URL</span>
            </label>
            <input
              type="url"
              name="photoURL"
              placeholder="https://example.com/photo.jpg"
              className="input input-bordered"
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="******"
              className="input input-bordered"
              required
            />
          </div>

          {/* Error and Success Messages */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>

          <p className="text-center mt-4 text-sm">
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
