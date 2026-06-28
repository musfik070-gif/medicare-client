"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/shared/ProtectedRoute";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Load the user from local storage so we know what links to show
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // 1. We wrap the ENTIRE dashboard in your new Security Guard!
  return (
    <ProtectedRoute>
      <div className="drawer lg:drawer-open">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        {/* Main Content Area */}
        <div className="drawer-content flex flex-col bg-base-200 min-h-screen">
          {/* Mobile Top Navbar (Only visible on small screens) */}
          <div className="w-full navbar bg-base-100 lg:hidden shadow-md border-b border-base-300">
            <div className="flex-none">
              <label
                htmlFor="dashboard-drawer"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2 mx-2 font-extrabold text-primary">
              MediCare Connect
            </div>
          </div>

          {/* Where the actual page content goes */}
          <div className="p-4 lg:p-8">{children}</div>
        </div>

        {/* Sidebar Sidebar Area */}
        <div className="drawer-side z-50">
          <label
            htmlFor="dashboard-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content border-r border-base-300 flex flex-col shadow-xl">
            {/* User Profile Header */}
            <div className="flex flex-col items-center mb-8 mt-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-5">
              <div className="avatar mb-3">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-lg">
                  <img
                    src={user?.photoURL || "https://via.placeholder.com/150"}
                    alt="Profile"
                  />
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-center">
                {user?.name || "Loading..."}
              </h2>
              <span className="badge badge-primary badge-outline uppercase mt-2">
                {user?.role}
              </span>
            </div>

            {/* Navigation Links based on Role */}
            <div className="flex-grow space-y-2">
              {/* Patient Links */}
              {user?.role === "patient" && (
                <>
                  <li>
                    <Link href="/dashboard/patient">My Dashboard</Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/patient/profile"
                      className="hover:text-primary"
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/patient/appointments">
                      My Appointments
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/patient/payments">
                      Payment History
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/patient/reviews">My Reviews</Link>
                  </li>
                </>
              )}

              {/* Doctor Links */}
              {user?.role === "doctor" && (
                <>
                  <li>
                    <Link href="/dashboard/doctor">Doctor Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/doctor/schedule">
                      Manage Schedule
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/doctor/requests">
                      Appointment Requests
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/doctor/prescriptions">
                      Prescriptions
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/doctor/profile">My Profile</Link>
                  </li>
                </>
              )}

              {/* Admin Links */}
              {user?.role === "admin" && (
                <>
                  <li>
                    <Link href="/dashboard/admin">Admin Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/admin/users">Manage Users</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/admin/doctors">Verify Doctors</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/admin/appointments">
                      All Appointments
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/admin/payments">
                      Payment Records
                    </Link>
                  </li>
                </>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="divider"></div>
            <li>
              <Link href="/">🏠 Back to Home</Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-error font-bold mt-2 hover:bg-error/10"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
