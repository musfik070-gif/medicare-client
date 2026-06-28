"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

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

  const getLinkClass = (path) => {
    const isActive = pathname === path;
    return isActive
      ? "text-sky-600 font-semibold border-b-2 border-sky-500 rounded-none px-3 py-2 flex items-center h-full"
      : "text-slate-600 hover:text-sky-600 transition-all duration-200 rounded-none px-3 py-2 flex items-center h-full relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-sky-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left";
  };

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 text-sky-500 transition-transform duration-200 hover:scale-[1.01]">
          <svg className="w-7 h-7 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="tracking-tight text-slate-800">MediCare<span className="text-sky-500">Connect</span></span>
        </Link>

        <ul className="menu menu-horizontal px-1 gap-2 items-center">
          <li>
            <Link href="/" className={getLinkClass("/")}>Home</Link>
          </li>
          <li>
            <Link href="/find-doctors" className={getLinkClass("/find-doctors")}>Find Doctors</Link>
          </li>
          <li>
            <Link href="/about" className={getLinkClass("/about")}>About Us</Link>
          </li>
          <li>
            <Link href="/contact" className={getLinkClass("/contact")}>Contact Us</Link>
          </li>
          {user?.role === "patient" && (
            <li>
              <Link href="/join-doctor" className="border border-sky-500 text-sky-500 hover:bg-sky-50/50 rounded-full px-4 py-2 font-medium transition-all duration-200 text-sm">
                Join as a Doctor
              </Link>
            </li>
          )}
          <li>
            <Link href={user?.role ? `/dashboard/${user.role}` : "/dashboard"} className={getLinkClass(user?.role ? `/dashboard/${user.role}` : "/dashboard")}>
              Dashboard
            </Link>
          </li>
        </ul>

        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-sky-100 hover:ring-sky-300 transition-all duration-200">
              <div className="w-10 rounded-full">
                <img
                  alt={user.name || "User profile"}
                  src={user.photoURL || "https://via.placeholder.com/150"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-white rounded-2xl z-[100] mt-3 w-56 p-3 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
            >
              <li className="px-4 py-2.5 border-b border-slate-100 mb-2">
                <span className="block p-0 font-semibold text-slate-800 text-sm">{user.name || "User"}</span>
                <span className="block p-0 text-xs text-slate-400 mt-0.5 break-all">{user.email}</span>
              </li>
              <li>
                <Link href={user?.role ? `/dashboard/${user.role}` : "/dashboard"} className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all text-sm">
                  Dashboard
                </Link>
              </li>
              <li className="mt-1">
                <button type="button" onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all text-sm font-medium w-full text-left">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="border border-sky-500 text-sky-500 hover:bg-sky-50 rounded-full px-5 py-2 font-medium transition-all duration-200 text-sm">
              Login
            </Link>
            <Link href="/register" className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-5 py-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
