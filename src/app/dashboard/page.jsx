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
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-base-100 rounded-2xl shadow-xl border border-base-300 p-8 md:p-12 text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 leading-tight">
        Welcome back, {user?.name || "User"}!
      </h1>
      <p className="text-lg text-base-content/60 text-center max-w-md leading-relaxed">
        This is your central hub. Please select an option from the sidebar menu
        on the left to manage your account and activities.
      </p>
    </div>
  );
}
