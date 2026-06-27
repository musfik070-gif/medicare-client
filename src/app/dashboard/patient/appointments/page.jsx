"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5001/api/appointments/patient/my-appointments",
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            My Appointments
          </h1>
          <p className="text-gray-500">
            Track the status of your upcoming and past medical consultations.
          </p>
        </div>
        <Link href="/find-doctors" className="btn btn-primary">
          Book New Appointment
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content text-sm">
            <tr>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Date & Time</th>
              <th>Fee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td className="font-bold">{appt.doctorName}</td>
                <td>{appt.specialization}</td>
                <td>
                  <div className="font-semibold">{appt.date}</div>
                  <div className="text-sm opacity-70">{appt.time}</div>
                </td>
                <td className="font-mono text-success font-semibold">
                  ${appt.fee}
                </td>
                <td>
                  <span
                    className={`badge ${
                      appt.status === "Completed"
                        ? "badge-success"
                        : appt.status === "Approved"
                          ? "badge-info"
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
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No appointments booked yet.
            </h3>
            <p className="text-gray-400 mb-6">Ready to see a specialist?</p>
            <Link href="/find-doctors" className="btn btn-outline btn-primary">
              Browse Verified Doctors
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
