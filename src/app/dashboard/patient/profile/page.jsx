"use client";

import React, { useEffect, useState } from "react";

export default function PatientProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user data stored during login
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-error">
        User data not found. Please log in again.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">
        My Profile
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Profile Image */}
        <div className="avatar">
          <div className="w-32 md:w-40 rounded-full overflow-hidden ring-4 ring-sky-100 shadow-md">
            <img
              src={user.photoURL || "https://via.placeholder.com/150"}
              alt={user.name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-grow space-y-5 w-full">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Full Name
            </p>
            <p className="text-lg font-bold text-slate-850">{user.name}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Email Address
            </p>
            <p className="text-base text-slate-600">{user.email}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Account Role
            </p>
            <span className="inline-block bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mt-1">
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
