"use client";

import { SERVER_URL } from "@/src/lib/api";

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

      const res = await fetch(`${SERVER_URL}/api/doctors/apply`, {
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
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 font-sans">
      <div className="card w-full max-w-2xl shadow-sm bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="card-body p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
            Apply to be a Doctor
          </h2>
          <p className="text-center text-slate-500 mb-8 text-sm">
            Join our network of verified medical professionals.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label py-1">
                  <span className="text-slate-600 text-sm font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full border border-slate-100 rounded-xl px-4 py-2.5 bg-slate-50 text-slate-500 text-sm min-h-[44px] cursor-not-allowed"
                />
              </div>
              <div className="form-control">
                <label className="label py-1">
                  <span className="text-slate-600 text-sm font-medium">Email</span>
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-slate-100 rounded-xl px-4 py-2.5 bg-slate-50 text-slate-500 text-sm min-h-[44px] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="text-slate-600 text-sm font-medium">Specialization</span>
              </label>
              <select
                name="specialization"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-700 bg-white text-sm min-h-[44px]"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label py-1">
                  <span className="text-slate-600 text-sm font-medium">
                    Years of Experience
                  </span>
                </label>
                <input
                  type="text"
                  name="experience"
                  required
                  placeholder="e.g., 5"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 text-sm min-h-[44px]"
                />
              </div>
              <div className="form-control">
                <label className="label py-1">
                  <span className="text-slate-600 text-sm font-medium">
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
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 text-sm min-h-[44px]"
                />
              </div>
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-3 font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-sm min-h-[44px]"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner text-white loading-sm"></span>
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
