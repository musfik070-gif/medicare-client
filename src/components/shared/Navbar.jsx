"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-bold">
          MediCare Connect
        </Link>

        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/find-doctors">Find Doctors</Link>
          </li>
          <li>
            <Link href="/about">About Us</Link>
          </li>
          <li>
            <Link href="/contact">Contact Us</Link>
          </li>
          {user?.role === "patient" && (
            <li>
              <Link href="/join-doctor" className="btn btn-sm btn-outline btn-primary">
                Join as a Doctor
              </Link>
            </li>
          )}
          <li>
            <Link href={user?.role ? `/dashboard/${user.role}` : "/dashboard"}>
              Dashboard
            </Link>
          </li>
        </ul>

        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt={user.name || "User profile"}
                  src={user.photoURL || "https://via.placeholder.com/150"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li className="px-4 py-2">
                <span className="block p-0 font-semibold">{user.name || "User"}</span>
                <span className="block p-0 text-xs opacity-70">{user.email}</span>
              </li>
              <li>
                <Link href={user?.role ? `/dashboard/${user.role}` : "/dashboard"}>
                  Dashboard
                </Link>
              </li>
              <li>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
