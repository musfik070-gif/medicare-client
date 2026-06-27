"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function PatientDashboardIndex() {
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
        Welcome, {user?.name || "Patient"}!
      </h1>
      <p className="text-lg text-gray-500 max-w-lg mb-8">
        This is your personal health hub. From here, you can track your upcoming
        appointments, view your payment history, and manage your medical
        journey.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/find-doctors" className="btn btn-primary">
          Book New Appointment
        </Link>
        <Link
          href="/dashboard/patient/appointments"
          className="btn btn-secondary"
        >
          My Appointments
        </Link>
      </div>
    </div>
  );
}
