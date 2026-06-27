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
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10">
      <h1 className="text-3xl font-bold text-primary mb-2">Verify Doctors</h1>
      <p className="text-gray-500 mb-8">
        Review pending doctor profiles and approve them for the platform.
      </p>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content text-sm">
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={
                            doc.profileImage ||
                            "https://via.placeholder.com/150"
                          }
                          alt={doc.doctorName}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{doc.doctorName}</div>
                      <div className="text-sm opacity-50">{doc.email}</div>
                    </div>
                  </div>
                </td>
                <td>{doc.specialization}</td>
                <td>{doc.experience} Years</td>
                <td>
                  <span
                    className={`badge badge-outline ${
                      doc.verificationStatus === "Verified"
                        ? "badge-success"
                        : doc.verificationStatus === "Rejected"
                          ? "badge-error"
                          : "badge-warning"
                    }`}
                  >
                    {doc.verificationStatus || "Pending"}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(doc._id, "Verified")}
                      className="btn btn-sm btn-success text-white"
                      disabled={doc.verificationStatus === "Verified"}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(doc._id, "Rejected")}
                      className="btn btn-sm btn-error text-white"
                      disabled={doc.verificationStatus === "Rejected"}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {doctors.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No doctors found in the database.
          </div>
        )}
      </div>
    </div>
  );
}
