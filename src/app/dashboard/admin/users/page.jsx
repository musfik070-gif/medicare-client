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
    <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">Manage Users</h1>
      <p className="text-base-content/60 mb-8">
        View, suspend, or delete user accounts on the platform.
      </p>

      <div className="overflow-x-auto rounded-xl border border-base-300">
        <table className="table table-zebra w-full">
          {/* Table Head */}
          <thead className="bg-base-200 text-base-content text-sm">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12 ring-1 ring-base-300">
                        <img
                          src={
                            user.photoURL || "https://via.placeholder.com/150"
                          }
                          alt={user.name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-base-content">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge ${user.role === "admin" ? "badge-primary" : "badge-ghost"} uppercase text-xs font-semibold`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${user.status === "suspended" ? "badge-error" : "badge-success"} badge-outline font-semibold`}
                  >
                    {user.status || "active"}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
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
                          className={`btn btn-sm shadow-sm ${user.status === "suspended" ? "btn-success" : "btn-warning"}`}
                        >
                          {user.status === "suspended" ? "Activate" : "Suspend"}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="btn btn-sm btn-error shadow-sm"
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
          <div className="text-center py-10 text-base-content/60">No users found.</div>
        )}
      </div>
    </div>
  );
}
