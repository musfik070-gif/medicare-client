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

    try {
      const response = await fetch(
        "http://localhost:5001/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            appointmentId: selectedAppt._id,
            price: selectedAppt.fee,
          }),
        },
      );
      const result = await response.json();
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        alert(result.message || "Payment failed.");
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            My Appointments
          </h1>
          <p className="text-slate-500 text-base">
            Track your consultations and medical records.
          </p>
        </div>
        <Link href="/find-doctors" className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-5 py-2.5 font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm">
          Book New
        </Link>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="py-4.5 px-6 font-semibold text-left">Doctor</th>
              <th className="py-4.5 px-6 font-semibold text-left">Date & Time</th>
              <th className="py-4.5 px-6 font-semibold text-left">Status</th>
              <th className="py-4.5 px-6 font-semibold text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((appt) => (
              <tr key={appt._id} className="hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                <td className="py-4 px-6 font-bold text-slate-800">{appt.doctorName}</td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-700">{appt.date}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{appt.time}</div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase border ${
                      appt.status === "Completed"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : appt.status === "Paid"
                          ? "bg-sky-50 text-sky-700 border-sky-200"
                          : appt.status === "Approved"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : appt.status === "Cancelled"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {appt.status || "Pending"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-2">
                    {appt.status === "Approved" && (
                      <button
                        onClick={() => openPaymentModal(appt)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-2 font-semibold transition-all duration-200 text-xs"
                      >
                        Pay Now
                      </button>
                    )}
                    {appt.status === "Completed" && (
                      <>
                        <button
                          onClick={() => openPrescriptionModal(appt)}
                          className="border border-sky-500 text-sky-500 hover:bg-sky-50/50 rounded-lg px-4 py-2 font-semibold transition-all duration-200 text-xs"
                        >
                          View Prescription
                        </button>
                        <button
                          onClick={() => openReviewModal(appt)}
                          className="text-slate-500 hover:text-slate-700 font-semibold px-2 py-1 text-xs"
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
                          className="border border-sky-500 text-sky-500 hover:bg-sky-50/50 rounded-lg px-4 py-2 font-semibold transition-all duration-200 text-xs"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(appt._id)}
                          className="border border-red-500 text-red-500 hover:bg-red-50/50 rounded-lg px-4 py-2 font-semibold transition-all duration-200 text-xs"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {appt.status === "Cancelled" && (
                      <span className="text-red-600 font-semibold text-xs bg-red-50 px-2 py-1 rounded-lg border border-red-100">Cancelled</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal modal-open bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="modal-box bg-white rounded-2xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Reschedule Appointment</h3>
            <form onSubmit={handleReschedule} className="space-y-4">
              <div className="form-control">
                <label className="label text-slate-600 text-sm font-medium">New Date</label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 text-sm"
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
              <div className="form-control">
                <label className="label text-slate-600 text-sm font-medium">New Time</label>
                <input
                  type="time"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 text-sm"
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
              <div className="modal-action gap-2 pt-2">
                <button
                  type="button"
                  className="border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
                <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-sm">
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      <dialog id="payment_modal" className="modal modal-bottom sm:modal-middle bg-slate-900/40 backdrop-blur-sm">
        <div className="modal-box bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="font-bold text-xl text-slate-800 mb-4">
            Secure Checkout
          </h3>
          <form onSubmit={handlePayment} className="space-y-4">
            <p className="text-base text-slate-600">
              Total Due:{" "}
              <span className="font-bold text-emerald-600">
                ${selectedAppt?.fee}
              </span>
            </p>
            <div className="modal-action gap-2 pt-2">
              <button
                type="button"
                className="border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
                onClick={() => document.getElementById("payment_modal").close()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-sm"
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
        className="modal modal-bottom sm:modal-middle bg-slate-900/40 backdrop-blur-sm"
      >
        <div className="modal-box w-11/12 max-w-2xl bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="font-bold text-xl text-slate-800 mb-2">
            Medical Prescription
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Dr. {selectedAppt?.doctorName} | {selectedAppt?.date}
          </p>

          <div className="bg-slate-50 p-6 rounded-xl whitespace-pre-wrap font-mono text-sm border border-slate-100 text-slate-700 min-h-[150px]">
            {selectedAppt?.prescription ||
              "No notes were provided by the doctor."}
          </div>

          <div className="modal-action">
            <button
              className="border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
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
      <dialog id="review_modal" className="modal modal-bottom sm:modal-middle bg-slate-900/40 backdrop-blur-sm">
        <div className="modal-box bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="font-bold text-xl text-slate-800 mb-4">
            Rate Your Experience
          </h3>
          <form onSubmit={handleReview} className="space-y-4">
            <div className="form-control">
              <label className="label text-slate-600 text-sm font-medium">
                Rating (1-5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="range range-info w-full"
                step="1"
              />
              <div className="w-full flex justify-between text-xs text-slate-400 mt-2 px-1">
                <span>1 ⭐️</span>
                <span>2 ⭐️</span>
                <span>3 ⭐️</span>
                <span>4 ⭐️</span>
                <span>5 ⭐️</span>
              </div>
            </div>
            <div className="form-control">
              <label className="label text-slate-600 text-sm font-medium">
                Feedback
              </label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 text-sm h-28"
                placeholder="How was your consultation?"
              ></textarea>
            </div>
            <div className="modal-action gap-2 pt-2">
              <button
                type="button"
                className="border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
                onClick={() => document.getElementById("review_modal").close()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-sm"
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
