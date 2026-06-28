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

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="table w-full border-collapse">
          {/* Table Head */}
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="py-4.5 px-6 font-semibold text-left">User</th>
              <th className="py-4.5 px-6 font-semibold text-left">Email</th>
              <th className="py-4.5 px-6 font-semibold text-left">Role</th>
              <th className="py-4.5 px-6 font-semibold text-left">Status</th>
              <th className="py-4.5 px-6 font-semibold text-left">Actions</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sky-100">
                        <img
                          src={
                            user.photoURL || "https://via.placeholder.com/150"
                          }
                          alt={user.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-500">{user.email}</td>
                <td className="py-4 px-6">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase border ${
                      user.role === "admin"
                        ? "bg-sky-50 text-sky-700 border-sky-200"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase border ${
                      user.status === "suspended"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {user.status || "active"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
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
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                            user.status === "suspended"
                              ? "bg-sky-500 hover:bg-sky-600 text-white"
                              : "bg-amber-500 hover:bg-amber-600 text-white"
                          }`}
                        >
                          {user.status === "suspended" ? "Activate" : "Suspend"}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                        >
                          Delete
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
