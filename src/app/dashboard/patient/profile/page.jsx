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
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-8 border-b pb-4">
        My Profile
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Profile Image */}
        <div className="avatar">
          <div className="w-32 md:w-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={user.photoURL || "https://via.placeholder.com/150"}
              alt={user.name}
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase">
              Full Name
            </p>
            <p className="text-xl font-bold text-base-content">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase">
              Email Address
            </p>
            <p className="text-lg text-base-content">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase">
              Account Role
            </p>
            <div className="badge badge-primary mt-1 capitalize">
              {user.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
