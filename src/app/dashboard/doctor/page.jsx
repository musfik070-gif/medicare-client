"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function DoctorDashboardIndex() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-base-100 rounded-2xl shadow-xl p-10 text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">
        Hello, Dr. {user?.name || "Doctor"}!
      </h1>
      <p className="text-lg text-gray-500 max-w-lg mb-8">
        Welcome to your professional dashboard. Here you can manage your
        upcoming appointments, review patient requests, and update your public
        profile.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/dashboard/doctor/requests" className="btn btn-primary">
          View Appointments
        </Link>
        <Link href="/dashboard/doctor/profile" className="btn btn-secondary">
          Update Profile
        </Link>
      </div>
    </div>
  );
}
