"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import ProtectedRoute from "../../components/shared/ProtectedRoute";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || "User",
  )}&background=0ea5e9&color=fff`;

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

  const getLinkClass = (path) => {
    const isActive = pathname === path;
    return isActive
      ? "flex items-center gap-3 px-4 py-3 rounded-none bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-semibold border-l-4 border-sky-500 pl-3 transition-all text-sm w-full"
      : "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-sky-50/50 dark:hover:bg-slate-950/20 hover:text-sky-600 dark:hover:text-sky-400 transition-all text-sm w-full";
  };

  return (
    <ProtectedRoute>
      <div className="drawer lg:drawer-open dashboard-theme-fix">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        {/* Main Content Area */}
        <div className="drawer-content flex flex-col bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
          {/* Mobile Top Navbar (Only visible on small screens) */}
          <div className="w-full navbar bg-white dark:bg-slate-900 lg:hidden shadow-sm border-b border-slate-100 dark:border-slate-800 px-4 py-3">
            <div className="flex-none">
              <label
                htmlFor="dashboard-drawer"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost text-sky-500 hover:bg-sky-50 dark:hover:bg-slate-800"
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
            <div className="flex-1 px-2 mx-2 font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <svg className="w-6 h-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              MediCare Connect
            </div>
          </div>

          {/* Where the actual page content goes */}
          <div className="p-4 lg:p-8 flex-grow">{children}</div>
        </div>

        {/* Sidebar Sidebar Area */}
        <div className="drawer-side z-50">
          <label
            htmlFor="dashboard-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm transition-colors duration-200">
            {/* User Profile Header */}
            <div className="flex flex-col items-center mb-6 mt-2 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50/50 dark:from-slate-800/40 dark:to-slate-800/20 p-6 border border-slate-100 dark:border-slate-800 relative">
              <span className="absolute top-3 right-3 badge bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900 text-xs font-semibold px-2 py-0.5 rounded-full uppercase">
                {user?.role}
              </span>
              <div className="avatar mb-3">
                <div className="w-20 rounded-full ring-4 ring-sky-100 dark:ring-slate-800 shadow-md">
                  <img
                    src={user?.photoURL || user?.profileImage || fallbackAvatar}
                    alt={user?.name || "Profile"}
                    onError={(event) => {
                      event.currentTarget.src = fallbackAvatar;
                    }}
                  />
                </div>
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white text-center">
                {user?.name || "Loading..."}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 break-all text-center max-w-full">
                {user?.email}
              </p>
            </div>

            {/* Navigation Links based on Role */}
            <div className="flex-grow space-y-1.5">
              {/* Patient Links */}
              {user?.role === "patient" && (
                <>
                  <li>
                    <Link href="/dashboard/patient" className={getLinkClass("/dashboard/patient")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      My Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/patient/profile" className={getLinkClass("/dashboard/patient/profile")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/patient/appointments" className={getLinkClass("/dashboard/patient/appointments")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      My Appointments
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/patient/payments" className={getLinkClass("/dashboard/patient/payments")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Payment History
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/patient/reviews" className={getLinkClass("/dashboard/patient/reviews")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.588 1.81l-3.97 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.88a1 1 0 00-1.178 0l-3.97 2.88c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.88c-.773-.558-.375-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      My Reviews
                    </Link>
                  </li>
                </>
              )}

              {/* Doctor Links */}
              {user?.role === "doctor" && (
                <>
                  <li>
                    <Link href="/dashboard/doctor" className={getLinkClass("/dashboard/doctor")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Doctor Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/doctor/schedule" className={getLinkClass("/dashboard/doctor/schedule")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Manage Schedule
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/doctor/requests" className={getLinkClass("/dashboard/doctor/requests")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Appointment Requests
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/doctor/prescriptions" className={getLinkClass("/dashboard/doctor/prescriptions")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Prescriptions
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/doctor/profile" className={getLinkClass("/dashboard/doctor/profile")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                  </li>
                </>
              )}

              {/* Admin Links */}
              {user?.role === "admin" && (
                <>
                  <li>
                    <Link href="/dashboard/admin" className={getLinkClass("/dashboard/admin")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/admin/users" className={getLinkClass("/dashboard/admin/users")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Manage Users
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/admin/doctors" className={getLinkClass("/dashboard/admin/doctors")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Verify Doctors
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/admin/appointments" className={getLinkClass("/dashboard/admin/appointments")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      All Appointments
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/admin/payments" className={getLinkClass("/dashboard/admin/payments")}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Payment Records
                    </Link>
                  </li>
                </>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="divider my-4 border-slate-100"></div>
            <li>
              <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-50/50 hover:text-sky-600 transition-all text-sm w-full">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </Link>
            </li>
            <li className="mt-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all text-sm font-semibold w-full text-left"
              >
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
