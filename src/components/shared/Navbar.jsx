"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const getLinkClass = (path) => {
    const isActive = pathname === path;
    return isActive
      ? "text-sky-600 font-semibold border-b-2 border-sky-500 rounded-none px-3 py-2.5 flex items-center h-full text-sm min-h-[44px]"
      : "text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-500 transition-all duration-200 rounded-none px-3 py-2.5 flex items-center h-full text-sm min-h-[44px] relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-sky-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left";
  };

  const getMobileLinkClass = (path) => {
    const isActive = pathname === path;
    return isActive
      ? "block w-full text-sky-600 font-bold bg-sky-50 dark:bg-sky-950/40 px-4 py-3 rounded-xl text-sm min-h-[44px]"
      : "block w-full text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all px-4 py-3 rounded-xl text-sm min-h-[44px]";
  };

  return (
    <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800 font-sans transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 min-h-[64px]">
        {/* Mobile Hamburger Toggle (Left of Logo) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2.5 text-slate-600 dark:text-slate-300 hover:text-sky-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold flex items-center gap-2 text-sky-500 transition-transform duration-200 hover:scale-[1.01] min-h-[44px]">
          <svg className="w-6 h-6 md:w-7 h-7 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="tracking-tight text-slate-800 dark:text-white">MediCare<span className="text-sky-500">Connect</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex menu menu-horizontal px-1 gap-2 items-center">
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
          <li>
            <Link href={user?.role ? `/dashboard/${user.role}` : "/dashboard"} className={getLinkClass(user?.role ? `/dashboard/${user.role}` : "/dashboard")}>
              Dashboard
            </Link>
          </li>
          {user?.role === "patient" && (
            <li>
              <Link href="/join-doctor" className="border border-sky-500 text-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 rounded-full px-4 py-2 font-medium transition-all duration-200 text-sm min-h-[44px] flex items-center">
                Join as a Doctor
              </Link>
            </li>
          )}
        </ul>

        {/* Theme Toggle + User Auth dropdown / action buttons */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <div className="w-5 h-5" />
            ) : theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-450 hover:text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 hover:text-sky-600" />
            )}
          </button>

          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center justify-center flex-shrink-0"
              >
                {(user?.photoURL || user?.image) ? (
                  <>
                    <img
                      src={user.photoURL || user.image}
                      alt={user.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-sky-200 cursor-pointer flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="w-10 h-10 rounded-full bg-sky-500 text-white hidden items-center justify-center font-semibold text-sm cursor-pointer flex-shrink-0 border-2 border-sky-200">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold text-sm cursor-pointer flex-shrink-0 border-2 border-sky-200">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-white dark:bg-slate-800 rounded-2xl z-[100] mt-3 w-56 p-3 shadow-xl border border-slate-100 dark:border-slate-750 animate-in fade-in zoom-in-95 duration-200"
              >
                <li className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 mb-2">
                  <span className="block p-0 text-sm font-semibold text-slate-800 dark:text-white">{user.name || "User"}</span>
                  <span className="block p-0 text-xs text-slate-400 dark:text-slate-500 mt-0.5 break-all">{user.email}</span>
                </li>
                <li>
                  <Link href={user?.role ? `/dashboard/${user.role}` : "/dashboard"} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-750 hover:text-sky-600 dark:hover:text-white transition-all text-sm min-h-[44px]">
                    Dashboard
                  </Link>
                </li>
                <li className="mt-1">
                  <button type="button" onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all text-sm font-medium w-full text-left min-h-[44px]">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/login" className="border border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 rounded-full px-4 md:px-5 py-2 font-medium transition-all duration-200 text-sm min-h-[44px] flex items-center">
                Login
              </Link>
              <Link href="/register" className="hidden sm:inline-flex bg-sky-500 hover:bg-sky-600 text-white rounded-full px-5 py-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm min-h-[44px] items-center">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-inner py-4 animate-in slide-in-from-top-4 duration-200">
          <ul className="flex flex-col px-4 gap-2">
            <li>
              <Link href="/" className={getMobileLinkClass("/")}>Home</Link>
            </li>
            <li>
              <Link href="/find-doctors" className={getMobileLinkClass("/find-doctors")}>Find Doctors</Link>
            </li>
            <li>
              <Link href="/about" className={getMobileLinkClass("/about")}>About Us</Link>
            </li>
            <li>
              <Link href="/contact" className={getMobileLinkClass("/contact")}>Contact Us</Link>
            </li>
            <li>
              <Link href={user?.role ? `/dashboard/${user.role}` : "/dashboard"} className={getMobileLinkClass(user?.role ? `/dashboard/${user.role}` : "/dashboard")}>
                Dashboard
              </Link>
            </li>
            {user?.role === "patient" && (
              <li>
                <Link href="/join-doctor" className={getMobileLinkClass("/join-doctor")}>Join as a Doctor</Link>
              </li>
            )}
            {!user && (
              <li className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 sm:hidden">
                <Link href="/register" className="w-full text-center bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-2.5 font-semibold transition-all duration-200 text-sm min-h-[44px] flex items-center justify-center">
                  Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
