"use client";

import { SERVER_URL } from "@/src/lib/api";

import React, { useEffect, useState } from "react";

export default function AppointmentRequestsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${SERVER_URL}/api/appointments/doctor/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();

      if (result.success) {
        setAppointments(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${SERVER_URL}/api/appointments/doctor/${id}/status`,
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
        fetchAppointments(); // Refresh the table
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
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Appointment Requests
      </h1>
      <p className="text-slate-500 text-base mb-8">
        Manage your upcoming patient consultations.
      </p>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="py-4.5 px-6 font-semibold text-left">Patient Details</th>
              <th className="py-4.5 px-6 font-semibold text-left">Date & Time</th>
              <th className="py-4.5 px-6 font-semibold text-left">Status</th>
              <th className="py-4.5 px-6 font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((appt) => (
              <tr key={appt._id} className="hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                <td className="py-4 px-6">
                  <div className="font-bold text-slate-800">
                    {appt.patientName || "Anonymous"}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{appt.patientEmail}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-700">
                    {appt.date || appt.appointmentDate}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {appt.time || appt.appointmentTime}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase border ${
                      (appt.status || appt.appointmentStatus) === "Completed"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : (appt.status || appt.appointmentStatus) ===
                            "Approved"
                          ? "bg-sky-50 text-sky-700 border-sky-200"
                          : (appt.status || appt.appointmentStatus) ===
                              "Rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {appt.status || appt.appointmentStatus || "Pending"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    {/* Only show Accept/Reject if it's currently Pending */}
                    {(!appt.status && !appt.appointmentStatus) ||
                    appt.status === "Pending" ||
                    appt.appointmentStatus === "Pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(appt._id, "Approved")
                          }
                          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-2.5 py-1.5 md:px-3 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 min-h-[44px]"
                          title="Accept Request"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="hidden md:inline">Accept</span>
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(appt._id, "Rejected")
                          }
                          className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-2.5 py-1.5 md:px-3 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 min-h-[44px]"
                          title="Reject Request"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="hidden md:inline">Reject</span>
                        </button>
                      </>
                    ) : null}

                    {(appt.status || appt.appointmentStatus) === "Approved" && (
                      <button
                        onClick={() =>
                          handleStatusChange(appt._id, "Completed")
                        }
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-2.5 py-1.5 md:px-3 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 min-h-[44px]"
                        title="Mark Completed"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="hidden md:inline">Mark Completed</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {appointments.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm bg-white">
            You have no appointment requests at this time.
          </div>
        )}
      </div>
    </div>
  );
}
