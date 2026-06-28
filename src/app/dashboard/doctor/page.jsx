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
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 sm:p-6 md:p-10 font-sans transition-colors duration-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Welcome back, Dr. {userName}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Here is an overview of your medical practice.
        </p>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {/* Total Patients */}
        <div className="card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-4 border-sky-500 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col justify-between p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-sky-50 text-sky-600 rounded-full p-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Total Patients
            </h2>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.totalPatients}</p>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-4 border-emerald-500 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col justify-between p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 text-emerald-600 rounded-full p-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <Link
              href="/dashboard/doctor/requests"
              className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold"
            >
              View Schedule
            </Link>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Today&apos;s Appointments
            </h2>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.todaysAppointments}</p>
          </div>
        </div>

        {/* Reviews Received */}
        <div className="card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-4 border-amber-500 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col justify-between p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 text-amber-600 rounded-full p-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.588 1.81l-3.97 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.88a1 1 0 00-1.178 0l-3.97 2.88c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.88c-.773-.558-.375-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Reviews Received
            </h2>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.reviewsReceived}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
