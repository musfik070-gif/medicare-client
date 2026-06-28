"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JoinDoctorPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    fee: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please login first to apply as a doctor.");
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Grab the token from local storage
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5001/api/doctors/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 2. Attach it to the headers here!
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          photoURL: user.photoURL || "https://via.placeholder.com/150",
          specialization: formData.specialization,
          experience: formData.experience,
          fee: formData.fee,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Application submitted successfully! Please wait for Admin approval.");
        router.push("/dashboard/patient");
      } else {
        alert(result.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Wait for redirect

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="card w-full max-w-2xl shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-primary mb-2">
            Apply to be a Doctor
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Join our network of verified medical professionals.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="input input-bordered bg-base-200"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input input-bordered bg-base-200"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Specialization</span>
              </label>
              <select
                name="specialization"
                required
                className="select select-bordered w-full"
                value={formData.specialization}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select your field
                </option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Years of Experience
                  </span>
                </label>
                <input
                  type="text"
                  name="experience"
                  required
                  placeholder="e.g., 5 Years"
                  value={formData.experience}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Consultation Fee ($)
                  </span>
                </label>
                <input
                  type="number"
                  name="fee"
                  required
                  placeholder="e.g., 50"
                  min="0"
                  value={formData.fee}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn btn-primary w-full text-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
