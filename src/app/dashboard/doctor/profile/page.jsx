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

        if (result.success && result.data.email) {
          // Pre-fill the form with existing data. Convert availableDays array to comma-string if needed.
          setFormData({
            ...result.data,
            availableDays: Array.isArray(result.data.availableDays)
              ? result.data.availableDays.join(", ")
              : result.data.availableDays || "",
          });
        } else {
          // If no profile exists yet, pre-fill name and photo from user auth data
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            setFormData((prev) => ({
              ...prev,
              doctorName: user.name,
              profileImage: user.photoURL,
            }));
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    // Convert comma-separated days into an array for the database
    const payload = {
      ...formData,
      experience: Number(formData.experience),
      consultationFee: Number(formData.consultationFee),
      availableDays: formData.availableDays.split(",").map((day) => day.trim()),
    };

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
      if (result.success) {
        setMessage(
          "Profile saved successfully! If you are a new doctor, wait for Admin verification.",
        );
      } else {
        setMessage("Failed to save profile.");
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage("An error occurred while saving.");
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
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-2">
        My Professional Profile
      </h1>
      <p className="text-gray-500 mb-8">
        Update your details. These will be visible to patients once verified.
      </p>

      {message && (
        <div
          className={`alert ${message.includes("success") ? "alert-success" : "alert-error"} mb-6`}
        >
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Full Name / Title</span>
          </label>
          <input
            type="text"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Specialization</span>
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiology"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Experience (Years)
              </span>
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Consultation Fee ($)
              </span>
            </label>
            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Hospital / Clinic Name
              </span>
            </label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Qualifications</span>
          </label>
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            placeholder="e.g. MBBS, MD"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Available Days</span>
          </label>
          <input
            type="text"
            name="availableDays"
            value={formData.availableDays}
            onChange={handleChange}
            placeholder="e.g. Monday, Wednesday, Friday"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Profile Image URL</span>
          </label>
          <input
            type="url"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control mt-8">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={saving}
          >
            {saving ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
