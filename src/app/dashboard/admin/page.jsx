"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardAnalytics() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    doctorPerformance: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5001/api/users/admin/analytics",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const result = await res.json();

        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-100 p-6 md:p-10 rounded-xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Platform Analytics
        </h1>
        <p className="text-gray-500">
          Overview of MediCare Connect&apos;s performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card bg-info text-info-content shadow-md">
          <div className="card-body flex-row items-center gap-4">
            <div className="text-5xl">👥</div>
            <div>
              <h2 className="card-title text-sm uppercase opacity-80">
                Total Patients
              </h2>
              <p className="text-4xl font-bold">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="card bg-success text-success-content shadow-md">
          <div className="card-body flex-row items-center gap-4">
            <div className="text-5xl">👨‍⚕️</div>
            <div>
              <h2 className="card-title text-sm uppercase opacity-80">
                Total Doctors
              </h2>
              <p className="text-4xl font-bold">{stats.totalDoctors}</p>
            </div>
          </div>
        </div>

        <div className="card bg-warning text-warning-content shadow-md">
          <div className="card-body flex-row items-center gap-4">
            <div className="text-5xl">📅</div>
            <div>
              <h2 className="card-title text-sm uppercase opacity-80">
                Total Appointments
              </h2>
              <p className="text-4xl font-bold">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts: Doctor Performance */}
      <div className="bg-base-200 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-6 text-base-content">
          Doctor Performance (Average Ratings)
        </h2>

        {stats.doctorPerformance.length > 0 ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.doctorPerformance}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fill: "#8884d8" }} />
                <YAxis domain={[0, 5]} tick={{ fill: "#8884d8" }} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#2a303c",
                    borderColor: "#2a303c",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="rating"
                  name="Average Rating (out of 5)"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            No review data available yet.
          </p>
        )}
      </div>
    </div>
  );
}
