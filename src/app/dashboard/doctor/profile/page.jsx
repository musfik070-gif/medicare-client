"use client";

import React, { useEffect, useState } from "react";

export default function DoctorProfilePage() {
  const [formData, setFormData] = useState({
    doctorName: "",
    specialization: "",
    qualifications: "",
    hospitalName: "",
    experience: "",
    consultationFee: "",
    availableDays: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5001/api/doctors/profile/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const result = await response.json();

        if (result.success && result.data && Object.keys(result.data).length > 0) {
          // Pre-fill the form with existing data securely ensuring no undefined/null values
          setFormData({
            doctorName: result.data.doctorName || "",
            specialization: result.data.specialization || "",
            qualifications: result.data.qualifications || "",
            hospitalName: result.data.hospitalName || "",
            experience: result.data.experience !== undefined && result.data.experience !== null ? result.data.experience : "",
            consultationFee: result.data.consultationFee !== undefined && result.data.consultationFee !== null ? result.data.consultationFee : "",
            availableDays: Array.isArray(result.data.availableDays)
              ? result.data.availableDays.join(", ")
              : result.data.availableDays || "",
            profileImage: result.data.profileImage || "",
          });
        } else {
          // If no profile exists yet, pre-fill name and photo from user auth data
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            setFormData({
              doctorName: user.name || "",
              specialization: "",
              qualifications: "",
              hospitalName: "",
              experience: "",
              consultationFee: "",
              availableDays: "",
              profileImage: user.photoURL || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value ?? "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    // Convert comma-separated days into an array for the database
    const payload = {
      ...formData,
      experience: formData.experience !== "" ? Number(formData.experience) : 0,
      consultationFee: formData.consultationFee !== "" ? Number(formData.consultationFee) : 0,
      availableDays: formData.availableDays ? formData.availableDays.split(",").map((day) => day.trim()) : [],
    };

    console.log("Saving doctor profile - Request payload:", payload);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5001/api/doctors/profile/me",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      console.log("Saving doctor profile - Response body:", result);

      if (result.success) {
        setMessage(result.message || "Profile saved successfully!");
      } else {
        setMessage(result.message || "Failed to save profile.");
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage(error.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        My Professional Profile
      </h1>
      <p className="text-slate-500 text-base mb-8">
        Update your details. These will be visible to patients once verified.
      </p>

      {message && (
        <div
          className={`border p-4 rounded-xl text-sm mb-6 ${
            message.includes("successfully")
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="form-control">
          <label className="label py-1">
            <span className="text-slate-600 text-sm font-medium">Full Name / Title</span>
          </label>
          <input
            type="text"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="form-control">
            <label className="label py-1">
              <span className="text-slate-600 text-sm font-medium">Specialization</span>
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiology"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 text-sm"
              required
            />
          </div>
          <div className="form-control">
            <label className="label py-1">
              <span className="text-slate-600 text-sm font-medium">
                Experience (Years)
              </span>
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="form-control">
            <label className="label py-1">
              <span className="text-slate-600 text-sm font-medium">
                Consultation Fee ($)
              </span>
            </label>
            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 text-sm"
              required
            />
          </div>
          <div className="form-control">
            <label className="label py-1">
              <span className="text-slate-600 text-sm font-medium">
                Hospital / Clinic Name
              </span>
            </label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 text-sm"
              required
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label py-1">
            <span className="text-slate-600 text-sm font-medium">Qualifications</span>
          </label>
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            placeholder="e.g. MBBS, MD"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 text-sm"
            required
          />
        </div>

        <div className="form-control">
          <label className="label py-1">
            <span className="text-slate-600 text-sm font-medium">Available Days</span>
          </label>
          <input
            type="text"
            name="availableDays"
            value={formData.availableDays}
            onChange={handleChange}
            placeholder="e.g. Monday, Wednesday, Friday"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 text-sm"
            required
          />
        </div>

        <div className="form-control">
          <label className="label py-1">
            <span className="text-slate-600 text-sm font-medium">Profile Image URL</span>
          </label>
          <input
            type="url"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 placeholder-slate-400 text-sm"
            required
          />
        </div>

        <div className="form-control mt-8">
          <button
            type="submit"
            className="w-full md:w-auto md:px-8 bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-3 font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-sm min-h-[44px]"
            disabled={saving}
          >
            {saving ? (
              <span className="loading loading-spinner text-white loading-sm"></span>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
