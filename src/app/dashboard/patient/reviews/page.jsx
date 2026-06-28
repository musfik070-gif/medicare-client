"use client";

import React, { useEffect, useState } from "react";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    rating: 5,
    reviewText: "",
  });

  const fetchMyReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5001/api/reviews/patient/my-reviews",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await res.json();
      if (result.success) setReviews(result.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) {
        alert("Review deleted successfully.");
        fetchMyReviews();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5001/api/reviews/${editData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: editData.rating,
            reviewText: editData.reviewText,
          }),
        },
      );
      const result = await res.json();
      if (result.success) {
        alert("Review updated successfully!");
        setIsModalOpen(false);
        fetchMyReviews();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 font-sans">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-slate-500 text-sm">You haven't written any reviews yet.</p>
      ) : (
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="py-4.5 px-6 font-semibold text-left">Doctor ID / Name</th>
                <th className="py-4.5 px-6 font-semibold text-left">Rating</th>
                <th className="py-4.5 px-6 font-semibold text-left">Review</th>
                <th className="py-4.5 px-6 font-semibold text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {review.doctorId || "Unknown Doctor"}
                  </td>
                  <td className="py-4 px-6 text-amber-400 font-semibold text-base">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                  </td>
                  <td className="py-4 px-6 max-w-xs truncate text-slate-500" title={review.reviewText}>
                    {review.reviewText}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditData({
                            id: review._id,
                            rating: review.rating,
                            reviewText: review.reviewText,
                          });
                          setIsModalOpen(true);
                        }}
                        className="border border-sky-500 text-sky-500 hover:bg-sky-50/50 rounded-lg px-2.5 py-1.5 md:px-3 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 min-h-[44px]"
                        title="Edit Review"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="hidden md:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="border border-red-500 text-red-500 hover:bg-red-50/50 rounded-lg px-2.5 py-1.5 md:px-3 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 min-h-[44px]"
                        title="Delete Review"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="hidden md:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal modal-open bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="modal-box bg-white rounded-2xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Edit Review</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="form-control">
                <label className="label text-slate-600 text-sm font-medium">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 text-sm"
                  value={editData.rating}
                  onChange={(e) =>
                    setEditData({ ...editData, rating: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label text-slate-600 text-sm font-medium">Review Text</label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 text-sm h-28"
                  value={editData.reviewText}
                  onChange={(e) =>
                    setEditData({ ...editData, reviewText: e.target.value })
                  }
                  required
                ></textarea>
              </div>
              <div className="modal-action gap-2 pt-2">
                <button
                  type="button"
                  className="border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
