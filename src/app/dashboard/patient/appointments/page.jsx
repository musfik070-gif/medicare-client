"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payment Modal State
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [processing, setProcessing] = useState(false);

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
        alert(`Payment Successful! Transaction ID: ${result.transactionId}`);
        document.getElementById("payment_modal").close();
        fetchAppointments(); // Refresh the table to show "Paid" status
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
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
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            My Appointments
          </h1>
          <p className="text-gray-500">
            Track the status of your upcoming and past medical consultations.
          </p>
        </div>
        <Link href="/find-doctors" className="btn btn-primary">
          Book New Appointment
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content text-sm">
            <tr>
              <th>Doctor Name</th>
              <th>Date & Time</th>
              <th>Fee</th>
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
                <td className="font-mono text-success font-semibold">
                  ${appt.fee}
                </td>
                <td>
                  <span
                    className={`badge ${
                      appt.status === "Paid" || appt.status === "Completed"
                        ? "badge-success"
                        : appt.status === "Approved"
                          ? "badge-info"
                          : appt.status === "Cancelled"
                            ? "badge-error"
                            : "badge-warning"
                    }`}
                  >
                    {appt.status || "Pending"}
                  </span>
                </td>
                <td>
                  {/* Show Pay button ONLY if status is Approved */}
                  {appt.status === "Approved" ? (
                    <button
                      onClick={() => openPaymentModal(appt)}
                      className="btn btn-sm btn-success text-white"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">
                      No action needed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Checkout Modal */}
      <dialog id="payment_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-2xl text-primary mb-4">
            Secure Checkout
          </h3>

          {selectedAppt && (
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Consultation with:</span>
                <span className="font-bold">{selectedAppt.doctorName}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Date & Time:</span>
                <span className="font-bold">
                  {selectedAppt.date} at {selectedAppt.time}
                </span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total Due:</span>
                <span className="font-bold text-success">
                  ${selectedAppt.fee}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Cardholder Name
                </span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Card Number (Simulated)
                </span>
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                required
                maxLength="16"
                className="input input-bordered w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Expiry Date</span>
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">CVV</span>
                </label>
                <input
                  type="text"
                  placeholder="123"
                  required
                  maxLength="3"
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div className="modal-action mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => document.getElementById("payment_modal").close()}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success text-white px-8"
                disabled={processing}
              >
                {processing ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  `Pay $${selectedAppt?.fee}`
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button disabled={processing}>close</button>
        </form>
      </dialog>
    </div>
  );
}
