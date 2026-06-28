"use client";

import React, { useEffect, useState } from "react";

export default function VerifyDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5001/api/doctors/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      if (result.success) {
        setDoctors(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5001/api/doctors/admin/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const result = await response.json();
      if (result.success) {
        fetchDoctors(); // Refresh list on success
      }
    } catch (error) {
      console.error("Status update failed:", error);
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 font-sans">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Verify Doctors</h1>
      <p className="text-slate-500 text-base mb-8">
        Review pending doctor profiles and approve them for the platform.
      </p>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="py-4.5 px-6 font-semibold text-left">Doctor</th>
              <th className="py-4.5 px-6 font-semibold text-left">Specialization</th>
              <th className="py-4.5 px-6 font-semibold text-left">Experience</th>
              <th className="py-4.5 px-6 font-semibold text-left">Status</th>
              <th className="py-4.5 px-6 font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {doctors.map((doc) => (
              <tr key={doc._id} className="hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sky-100">
                        <img
                          src={
                            doc.profileImage ||
                            "https://via.placeholder.com/150"
                          }
                          alt={doc.doctorName}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{doc.doctorName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{doc.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">{doc.specialization}</td>
                <td className="py-4 px-6 text-slate-600">{doc.experience} Years</td>
                <td className="py-4 px-6">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase border ${
                      doc.verificationStatus === "Verified"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : doc.verificationStatus === "Rejected"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {doc.verificationStatus || "Pending"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(doc._id, "Verified")}
                      className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-lg px-2.5 py-1.5 md:px-3 text-xs font-semibold transition-all duration-200 shadow-sm flex items-center gap-1.5 min-h-[44px]"
                      disabled={doc.verificationStatus === "Verified"}
                      title="Approve Doctor"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="hidden md:inline">Approve</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(doc._id, "Rejected")}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-lg px-2.5 py-1.5 md:px-3 text-xs font-semibold transition-all duration-200 shadow-sm flex items-center gap-1.5 min-h-[44px]"
                      disabled={doc.verificationStatus === "Rejected"}
                      title="Reject Doctor"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="hidden md:inline">Reject</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {doctors.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm bg-white">
            No doctors found in the database.
          </div>
        )}
      </div>
    </div>
  );
}
