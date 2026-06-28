"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function PatientDashboardOverview() {
  const [stats, setStats] = useState({
    upcoming: 0,
    history: 0,
    totalPayments: 0,
    favoriteDoctors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserName(user.name || "Patient");

        const apptRes = await fetch(
          "http://localhost:5001/api/appointments/patient/my-appointments",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const apptResult = await apptRes.json();

        const payRes = await fetch(
          "http://localhost:5001/api/payments/patient/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const payResult = await payRes.json();

        let upcomingCount = 0;
        let historyCount = 0;
        let totalPaid = 0;

        if (apptResult.success) {
          const appointments = apptResult.data;
          upcomingCount = appointments.filter(
            (a) =>
              a.status === "Pending" ||
              a.status === "Approved" ||
              a.status === "Paid",
          ).length;
          historyCount = appointments.filter(
            (a) => a.status === "Completed",
          ).length;
        }

        if (payResult.success) {
          const payments = payResult.data;
          totalPaid = payments.reduce(
            (sum, payment) => sum + Number(payment.amount),
            0,
          );
        }

        setStats({
          upcoming: upcomingCount,
          history: historyCount,
          totalPayments: totalPaid,
          favoriteDoctors: 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
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
          Welcome back, {userName}!
        </h1>
        <p className="text-slate-505 dark:text-slate-400 text-base">
          Here is an overview of your healthcare journey.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        {/* Card 1: Upcoming Appointments */}
        <div className="card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-4 border-sky-500 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col justify-between p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-sky-50 text-sky-600 rounded-full p-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <Link
              href="/dashboard/patient/appointments"
              className="text-xs text-sky-500 hover:text-sky-600 font-semibold"
            >
              View All
            </Link>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming Appointments
            </h2>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.upcoming}</p>
          </div>
        </div>

        {/* Card 2: Appointment History */}
        <div className="card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-4 border-emerald-500 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col justify-between p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 text-emerald-600 rounded-full p-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Link
              href="/dashboard/patient/appointments"
              className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold"
            >
              View History
            </Link>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Appointment History
            </h2>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.history}</p>
          </div>
        </div>

        {/* Card 3: Total Payments */}
        <div className="card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-4 border-amber-500 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col justify-between p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 text-amber-600 rounded-full p-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Link
              href="/dashboard/patient/payments"
              className="text-xs text-amber-500 hover:text-amber-600 font-semibold"
            >
              View Invoices
            </Link>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Total Payments
            </h2>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">${stats.totalPayments}</p>
          </div>
        </div>

        {/* Card 4: Favorite Doctors */}
        <div className="card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-4 border-purple-500 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col justify-between p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 text-purple-600 rounded-full p-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <Link
              href="/find-doctors"
              className="text-xs text-purple-500 hover:text-purple-600 font-semibold"
            >
              Find Doctors
            </Link>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Favorite Doctors
            </h2>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.favoriteDoctors}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
