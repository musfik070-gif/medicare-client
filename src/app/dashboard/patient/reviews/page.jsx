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
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10">
      <h1 className="text-3xl font-bold text-primary mb-6">My Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-500">You haven't written any reviews yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Doctor ID / Name</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className="font-semibold">
                    {review.doctorId || "Unknown Doctor"}
                  </td>
                  <td className="text-warning">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                  </td>
                  <td className="max-w-xs truncate" title={review.reviewText}>
                    {review.reviewText}
                  </td>
                  <td>
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
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
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
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Review</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-control mb-4">
                <label className="label">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="input input-bordered w-full"
                  value={editData.rating}
                  onChange={(e) =>
                    setEditData({ ...editData, rating: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Review Text</label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  value={editData.reviewText}
                  onChange={(e) =>
                    setEditData({ ...editData, reviewText: e.target.value })
                  }
                  required
                ></textarea>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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
