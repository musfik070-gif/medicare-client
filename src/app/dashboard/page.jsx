"use client";

import React, { useEffect, useState } from "react";

export default function DashboardIndexPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-base-100 rounded-2xl shadow-xl p-10">
      <h1 className="text-4xl font-bold text-primary mb-4">
        Welcome back, {user?.name || "User"}!
      </h1>
      <p className="text-lg text-gray-500 text-center max-w-md">
        This is your central hub. Please select an option from the sidebar menu
        on the left to manage your account and activities.
      </p>
    </div>
  );
}
