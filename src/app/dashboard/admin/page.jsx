"use client";

import React from "react";
import Link from "next/link";

export default function AdminDashboardIndex() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-base-100 rounded-2xl shadow-xl p-10 text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">
        Admin Control Center
      </h1>
      <p className="text-lg text-gray-500 max-w-lg mb-8">
        Welcome to the Admin Dashboard. From here, you have full control over
        the MediCare Connect platform. Use the quick links below or the sidebar
        to navigate.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/dashboard/admin/users" className="btn btn-primary">
          Manage Users
        </Link>
        <Link href="/dashboard/admin/doctors" className="btn btn-secondary">
          Verify Doctors
        </Link>
        <Link href="/dashboard/admin/payments" className="btn btn-accent">
          View Revenue
        </Link>
      </div>
    </div>
  );
}
