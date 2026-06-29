"use client";

import { SERVER_URL } from "@/src/lib/api";

import React, { useEffect, useState } from "react";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${SERVER_URL}/api/appointments/admin/all`,
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

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 font-sans">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">All Appointments</h1>
      <p className="text-slate-500 text-base mb-8">
        Platform-wide overview of all booked appointments.
      </p>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="py-4.5 px-6 font-semibold text-left">Patient</th>
              <th className="py-4.5 px-6 font-semibold text-left">Doctor</th>
              <th className="py-4.5 px-6 font-semibold text-left">Date & Time</th>
              <th className="py-4.5 px-6 font-semibold text-left">Fee</th>
              <th className="py-4.5 px-6 font-semibold text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((appt) => (
              <tr key={appt._id} className="hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                <td className="py-4 px-6 font-semibold text-slate-800">{appt.patientName}</td>
                <td className="py-4 px-6 text-slate-600">{appt.doctorName}</td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-700">{appt.date}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{appt.time}</div>
                </td>
                <td className="py-4 px-6 font-mono text-slate-500 font-semibold">${appt.fee}</td>
                <td className="py-4 px-6">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase border ${
                      appt.status === "Completed"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : appt.status === "Cancelled"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {appt.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {appointments.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm bg-white">
            No appointments have been booked yet.
          </div>
        )}
      </div>
    </div>
  );
}
