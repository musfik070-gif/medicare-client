"use client";

import React, { useEffect, useState } from "react";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5001/api/appointments/admin/all",
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
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10">
      <h1 className="text-3xl font-bold text-primary mb-2">All Appointments</h1>
      <p className="text-gray-500 mb-8">
        Platform-wide overview of all booked appointments.
      </p>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content text-sm">
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>Fee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td className="font-semibold">{appt.patientName}</td>
                <td>{appt.doctorName}</td>
                <td>
                  <div className="text-sm">{appt.date}</div>
                  <div className="text-xs opacity-70">{appt.time}</div>
                </td>
                <td className="font-mono">${appt.fee}</td>
                <td>
                  <span
                    className={`badge badge-sm ${
                      appt.status === "Completed"
                        ? "badge-success"
                        : appt.status === "Cancelled"
                          ? "badge-error"
                          : "badge-warning"
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
          <div className="text-center py-10 text-gray-500">
            No appointments have been booked yet.
          </div>
        )}
      </div>
    </div>
  );
}
