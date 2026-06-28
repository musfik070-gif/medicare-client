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
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-500">
          Here is an overview of your healthcare journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="card bg-info text-info-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-sm uppercase opacity-80">
              Upcoming Appointments
            </h2>
            <p className="text-4xl font-bold">{stats.upcoming}</p>
            <div className="card-actions justify-end mt-2">
              <Link
                href="/dashboard/patient/appointments"
                className="btn btn-sm btn-ghost"
              >
                View
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-success text-success-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-sm uppercase opacity-80">
              Appointment History
            </h2>
            <p className="text-4xl font-bold">{stats.history}</p>
            <div className="card-actions justify-end mt-2">
              <Link
                href="/dashboard/patient/appointments"
                className="btn btn-sm btn-ghost"
              >
                View
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-warning text-warning-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-sm uppercase opacity-80">
              Total Payments
            </h2>
            <p className="text-4xl font-bold">${stats.totalPayments}</p>
            <div className="card-actions justify-end mt-2">
              <Link
                href="/dashboard/patient/payments"
                className="btn btn-sm btn-ghost"
              >
                View
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-secondary text-secondary-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-sm uppercase opacity-80">
              Favorite Doctors
            </h2>
            <p className="text-4xl font-bold">{stats.favoriteDoctors}</p>
            <div className="card-actions justify-end mt-2">
              <Link href="/find-doctors" className="btn btn-sm btn-ghost">
                Find
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
