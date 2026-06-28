"use client";

import React, { useEffect, useState } from "react";

export default function AppointmentRequestsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5001/api/appointments/doctor/requests",
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
        `http://localhost:5001/api/appointments/doctor/${id}/status`,
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
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10">
      <h1 className="text-3xl font-bold text-primary mb-2">
        Appointment Requests
      </h1>
      <p className="text-gray-500 mb-8">
        Manage your upcoming patient consultations.
      </p>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content text-sm">
            <tr>
              <th>Patient Details</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>
                  <div className="font-bold">
                    {appt.patientName || "Anonymous"}
                  </div>
                  <div className="text-sm opacity-70">{appt.patientEmail}</div>
                </td>
                <td>
                  <div className="font-semibold">
                    {appt.date || appt.appointmentDate}
                  </div>
                  <div className="text-sm">
                    {appt.time || appt.appointmentTime}
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${
                      (appt.status || appt.appointmentStatus) === "Completed"
                        ? "badge-success"
                        : (appt.status || appt.appointmentStatus) ===
                            "Approved"
                          ? "badge-info"
                          : "badge-warning"
                    }`}
                  >
                    {appt.status || appt.appointmentStatus || "Pending"}
                  </span>
                </td>
                <td>
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
                          className="btn btn-sm btn-success text-white"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(appt._id, "Rejected")
                          }
                          className="btn btn-sm btn-error text-white"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}

                    {appt.status === "Rejected" ||
                    appt.appointmentStatus === "Rejected" ? (
                      <span className="text-error font-bold">Rejected</span>
                    ) : null}

                    {(appt.status || appt.appointmentStatus) === "Approved" && (
                      <button
                        onClick={() =>
                          handleStatusChange(appt._id, "Completed")
                        }
                        className="btn btn-sm btn-success text-white"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {appointments.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            You have no appointment requests at this time.
          </div>
        )}
      </div>
    </div>
  );
}
