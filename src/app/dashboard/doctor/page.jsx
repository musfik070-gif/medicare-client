"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function DoctorDashboardOverview() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todaysAppointments: 0,
    reviewsReceived: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserName(user.name || "Doctor");

        // 1. Fetch Appointments
        const apptRes = await fetch("http://localhost:5001/api/appointments/doctor/requests", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const apptResult = await apptRes.json();

        let uniquePatients = new Set();
        let todayCount = 0;
        let reviewsCount = 0;
        let doctorIds = new Set(user._id ? [user._id] : []);

        const today = new Date().toISOString().split('T')[0];

        if (apptResult.success) {
          const appointments = apptResult.data;
          appointments.forEach(appt => {
            uniquePatients.add(appt.patientEmail);
            if (appt.doctorId) {
              doctorIds.add(appt.doctorId);
            }
            if (appt.date === today || appt.appointmentDate === today) {
              todayCount++;
            }
          });
        }

        const reviewResults = await Promise.all(
          [...doctorIds].map(async (doctorId) => {
            const reviewRes = await fetch(
              `http://localhost:5001/api/reviews/doctor/${doctorId}`,
            );
            const reviewResult = await reviewRes.json();
            return reviewResult.success ? reviewResult.data : [];
          }),
        );
        const reviews = reviewResults.flat();
        reviewsCount = new Set(reviews.map((review) => review._id)).size;

        setStats({
          totalPatients: uniquePatients.size,
          todaysAppointments: todayCount,
          reviewsReceived: reviewsCount,
        });

      } catch (error) {
        console.error("Failed to load doctor dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welcome back, Dr. {userName}!
        </h1>
        <p className="text-gray-500">
          Here is an overview of your medical practice.
        </p>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Patients */}
        <div className="card bg-info text-info-content shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="text-5xl">👥</div>
              <div>
                <h2 className="card-title text-sm uppercase opacity-80">
                  Total Patients
                </h2>
                <p className="text-4xl font-bold">{stats.totalPatients}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="card bg-success text-success-content shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="text-5xl">📅</div>
              <div>
                <h2 className="card-title text-sm uppercase opacity-80">
                  Today's Appointments
                </h2>
                <p className="text-4xl font-bold">{stats.todaysAppointments}</p>
              </div>
            </div>
            <div className="card-actions justify-end mt-2">
              <Link
                href="/dashboard/doctor/requests"
                className="btn btn-sm btn-ghost"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Received */}
        <div className="card bg-warning text-warning-content shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="text-5xl">⭐</div>
              <div>
                <h2 className="card-title text-sm uppercase opacity-80">
                  Reviews Received
                </h2>
                <p className="text-4xl font-bold">{stats.reviewsReceived}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
