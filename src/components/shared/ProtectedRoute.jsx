"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Grab the token and user data we saved during Login
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    // 2. If they don't exist, kick them to the login page
    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);

      // 3. If this route requires specific roles, check if the user matches
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          // If they are logged in but have the wrong role, send them to a safe page
          console.warn(
            `Access Denied: Requires ${allowedRoles.join(" or ")}, but user is ${user.role}`,
          );
          router.push("/");
          return;
        }
      }

      // 4. If they pass all checks, let them in!
      setIsAuthorized(true);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router, allowedRoles]);

  // Show a loading spinner while the security check happens
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-4 font-semibold text-base-content/60">Verifying access...</p>
      </div>
    );
  }

  // Render the actual private page if authorized
  return <>{children}</>;
}
