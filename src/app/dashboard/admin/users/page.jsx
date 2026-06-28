"use client";

import React, { useEffect, useState } from "react";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users on load
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Suspend / Activate
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5001/api/users/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Refresh the UI safely
        fetchUsers();
      }
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? This cannot be undone.",
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5001/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 font-sans">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Manage Users</h1>
      <p className="text-slate-500 text-base mb-8">
        View, suspend, or delete user accounts on the platform.
      </p>

      <div className="overflow-x-auto w-full max-w-full rounded-xl border border-slate-200">
        <table className="table w-full border-collapse">
          {/* Table Head */}
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="py-4.5 px-6 font-semibold text-left w-[180px]">User</th>
              <th className="py-4.5 px-6 font-semibold text-left w-[180px]">Email</th>
              <th className="py-4.5 px-6 font-semibold text-left w-[90px]">Role</th>
              <th className="py-4.5 px-6 font-semibold text-left w-[90px]">Status</th>
              <th className="py-4.5 px-6 font-semibold text-left w-[150px]">Actions</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                <td className="py-4 px-6 w-[180px] max-w-[180px]">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-sky-100">
                        <img
                          src={
                            user.photoURL || "https://via.placeholder.com/150"
                          }
                          alt={user.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-800 truncate" title={user.name}>{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500 truncate max-w-[160px] w-[180px]" title={user.email}>{user.email}</td>
                <td className="py-4 px-6 w-[90px]">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase border ${
                      user.role === "admin"
                        ? "bg-sky-50 text-sky-700 border-sky-200"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6 w-[90px]">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase border ${
                      user.status === "suspended"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {user.status || "active"}
                  </span>
                </td>
                <td className="py-4 px-6 w-[150px]">
                  <div className="flex gap-2 items-center">
                    {/* Don't let an admin delete/suspend themselves! */}
                    {user.role !== "admin" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              user._id,
                              user.status || "active",
                            )
                          }
                          className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 min-h-[44px] ${
                            user.status === "suspended"
                              ? "bg-sky-500 hover:bg-sky-600 text-white"
                              : "bg-amber-500 hover:bg-amber-600 text-white"
                          }`}
                          title={user.status === "suspended" ? "Activate User" : "Suspend User"}
                        >
                          {user.status === "suspended" ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                          <span className="hidden md:inline">
                            {user.status === "suspended" ? "Activate" : "Suspend"}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-2 py-1.5 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 min-h-[44px]"
                          title="Delete User"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="hidden md:inline">Delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm bg-white">No users found.</div>
        )}
      </div>
    </div>
  );
}
