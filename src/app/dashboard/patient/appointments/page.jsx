"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleData, setRescheduleData] = useState({
    id: null,
    date: "",
    time: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modals State
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5001/api/appointments/patient/my-appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json();
      if (result.success) setAppointments(result.data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openPaymentModal = (appt) => {
    setSelectedAppt(appt);
    document.getElementById("payment_modal").showModal();
  };

  const openPrescriptionModal = (appt) => {
    setSelectedAppt(appt);
    document.getElementById("prescription_modal").showModal();
  };

  const openReviewModal = (appt) => {
    setSelectedAppt(appt);
    setRating(5);
    setComment("");
    document.getElementById("review_modal").showModal();
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Appointment Cancelled.");
        window.location.reload();
      } else {
        alert(result.message || "Failed to cancel.");
      }
    } catch (error) {
      console.error("Cancel Error:", error);
      alert("An error occurred. Check browser console.");
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5001/api/appointments/${rescheduleData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            appointmentDate: rescheduleData.date,
            appointmentTime: rescheduleData.time,
            status: "Pending",
          }),
        },
      );

      const result = await res.json();
      if (result.success) {
        alert("Appointment Rescheduled!");
        setIsModalOpen(false);
        window.location.reload();
      } else {
        alert(result.message || "Failed to reschedule.");
      }
    } catch (error) {
      console.error("Reschedule Error:", error);
      alert("An error occurred. Check browser console.");
    }
  };

  // --- HANDLERS ---
  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const token = localStorage.getItem("token");
    const payload = {
      appointmentId: selectedAppt._id,
      doctorId: selectedAppt.doctorId,
      doctorName: selectedAppt.doctorName,
      patientName: selectedAppt.patientName,
      fee: selectedAppt.fee,
    };

    try {
      const response = await fetch(
        "http://localhost:5001/api/payments/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();
      if (result.success) {
        alert("Payment Successful!");
        document.getElementById("payment_modal").close();
        fetchAppointments();
      }
    } catch (error) {
      alert("Payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5001/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: selectedAppt.doctorId,
          doctorName: selectedAppt.doctorName,
          patientName: selectedAppt.patientName,
          rating,
          comment,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Review submitted! Thank you for your feedback.");
        document.getElementById("review_modal").close();
      }
    } catch (error) {
      alert("Failed to submit review.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            My Appointments
          </h1>
          <p className="text-gray-500">
            Track your consultations and medical records.
          </p>
        </div>
        <Link href="/find-doctors" className="btn btn-primary">
          Book New
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content text-sm">
            <tr>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td className="font-bold">{appt.doctorName}</td>
                <td>
                  <div className="font-semibold">{appt.date}</div>
                  <div className="text-sm opacity-70">{appt.time}</div>
                </td>
                <td>
                  <span
                    className={`badge ${
                      appt.status === "Completed"
                        ? "badge-success"
                        : appt.status === "Paid"
                          ? "badge-info"
                          : "badge-warning"
                    }`}
                  >
                    {appt.status || "Pending"}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {appt.status === "Approved" && (
                      <button
                        onClick={() => openPaymentModal(appt)}
                        className="btn btn-sm btn-success text-white"
                      >
                        Pay Now
                      </button>
                    )}
                    {appt.status === "Completed" && (
                      <>
                        <button
                          onClick={() => openPrescriptionModal(appt)}
                          className="btn btn-sm btn-outline btn-primary"
                        >
                          View Note
                        </button>
                        <button
                          onClick={() => openReviewModal(appt)}
                          className="btn btn-sm btn-ghost text-secondary"
                        >
                          Leave Review
                        </button>
                      </>
                    )}
                    {(appt.status === "Pending" ||
                      appt.status === "Approved") && (
                      <>
                        <button
                          onClick={() => {
                            setRescheduleData({
                              id: appt._id,
                              date: appt.date,
                              time: appt.time,
                            });
                            setIsModalOpen(true);
                          }}
                          className="btn btn-sm btn-outline btn-primary"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(appt._id)}
                          className="btn btn-sm btn-outline btn-error"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {appt.status === "Cancelled" && (
                      <span className="text-error font-bold">Cancelled</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Reschedule Appointment</h3>
            <form onSubmit={handleReschedule}>
              <div className="form-control mb-4">
                <label className="label">New Date</label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  required
                  value={rescheduleData.date}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">New Time</label>
                <input
                  type="time"
                  className="input input-bordered w-full"
                  required
                  value={rescheduleData.time}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      time: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PAYMENT MODAL (Same as Step 22) --- */}
      <dialog id="payment_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-2xl text-primary mb-4">
            Secure Checkout
          </h3>
          <form onSubmit={handlePayment}>
            <p className="mb-4 text-lg">
              Total Due:{" "}
              <span className="font-bold text-success">
                ${selectedAppt?.fee}
              </span>
            </p>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => document.getElementById("payment_modal").close()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success text-white"
                disabled={processing}
              >
                Confirm Payment
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* --- PRESCRIPTION VIEW MODAL --- */}
      <dialog
        id="prescription_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-2xl text-primary mb-2">
            Medical Prescription
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Dr. {selectedAppt?.doctorName} | {selectedAppt?.date}
          </p>

          <div className="bg-base-200 p-6 rounded-lg whitespace-pre-wrap font-mono text-sm border border-base-300 min-h-[150px]">
            {selectedAppt?.prescription ||
              "No notes were provided by the doctor."}
          </div>

          <div className="modal-action">
            <button
              className="btn"
              onClick={() =>
                document.getElementById("prescription_modal").close()
              }
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      {/* --- REVIEW MODAL --- */}
      <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-2xl text-primary mb-4">
            Rate Your Experience
          </h3>
          <form onSubmit={handleReview}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Rating (1-5)</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="range range-primary"
                step="1"
              />
              <div className="w-full flex justify-between text-xs px-2 mt-2">
                <span>1 ⭐️</span>
                <span>2 ⭐️</span>
                <span>3 ⭐️</span>
                <span>4 ⭐️</span>
                <span>5 ⭐️</span>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Feedback</span>
              </label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="textarea textarea-bordered h-24"
                placeholder="How was your consultation?"
              ></textarea>
            </div>
            <div className="modal-action mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => document.getElementById("review_modal").close()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={processing}
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
