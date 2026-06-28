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
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-100">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Platform Analytics
        </h1>
        <p className="text-slate-500 text-base">
          Overview of MediCare Connect&apos;s performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Total Patients */}
        <div className="card bg-white rounded-2xl border border-slate-100 border-l-4 border-sky-500 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col justify-between p-6">
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
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalPatients}</p>
          </div>
        </div>

        {/* Card 2: Total Doctors */}
        <div className="card bg-white rounded-2xl border border-slate-100 border-l-4 border-emerald-500 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col justify-between p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 text-emerald-600 rounded-full p-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Total Doctors
            </h2>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalDoctors}</p>
          </div>
        </div>

        {/* Card 3: Total Appointments */}
        <div className="card bg-white rounded-2xl border border-slate-100 border-l-4 border-amber-500 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col justify-between p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 text-amber-600 rounded-full p-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Total Appointments
            </h2>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalAppointments}</p>
          </div>
        </div>
      </div>

      {/* Recharts: Doctor Performance */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h2 className="text-lg font-bold mb-6 text-slate-800">
          Doctor Performance (Average Ratings)
        </h2>

        {stats.doctorPerformance.length > 0 ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.doctorPerformance}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" tick={{ fill: "#64748B" }} stroke="#CBD5E1" />
                <YAxis domain={[0, 5]} tick={{ fill: "#64748B" }} stroke="#CBD5E1" />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#0F172A",
                    color: "#fff",
                    borderRadius: "12px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="rating"
                  name="Average Rating (out of 5)"
                  fill="#0EA5E9"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-slate-400 py-10 text-sm">
            No review data available yet.
          </p>
        )}
      </div>
    </div>
  );
}
