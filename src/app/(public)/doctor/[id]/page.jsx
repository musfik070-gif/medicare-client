"use client";

import { SERVER_URL } from "@/src/lib/api";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function DoctorDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(
          `${SERVER_URL}/api/doctors/${params.id}`,
        );
        const result = await response.json();

        if (result.success) {
          setDoctor(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch doctor details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchDoctorDetails();
  }, [params.id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setBookingMessage(
        "You must be logged in as a patient to book an appointment.",
      );
      setBookingLoading(false);
      return;
    }

    const payload = {
      doctorId: doctor._id,
      doctorName: doctor.doctorName,
      doctorEmail: doctor.email,
      specialization: doctor.specialization,
      fee: doctor.consultationFee,
      date: bookingDate,
      time: bookingTime,
    };

    try {
      const response = await fetch(`${SERVER_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        alert("Appointment successfully requested!");
        document.getElementById("booking_modal").close();
        router.push("/dashboard/patient/appointments"); // Send them to their dashboard!
      } else {
        setBookingMessage(result.message || "Failed to book appointment.");
      }
    } catch (error) {
      setBookingMessage("An error occurred during booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-error">Doctor Not Found</h2>
        <Link href="/find-doctors" className="btn btn-primary mt-4">
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="lg:flex bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <figure className="lg:w-1/3 flex justify-center">
            <img
              src={doctor.profileImage || "https://via.placeholder.com/300"}
              alt={doctor.doctorName}
              className="rounded-xl w-64 h-64 object-cover border-2 border-slate-200 dark:border-slate-700"
            />
          </figure>

          <div className="lg:w-2/3 lg:pl-8 pt-8 lg:pt-0">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              {doctor.doctorName}
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-sm font-medium px-3 py-1 rounded-full">
                {doctor.specialization}
              </span>
              <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700 text-sm px-3 py-1 rounded-full">
                Verified ✔
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-slate-700 dark:text-slate-300 text-sm">
                Qualifications:{" "}
                <span className="text-slate-900 dark:text-white font-medium">
                  {doctor.qualifications}
                </span>
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-sm">
                Hospital:{" "}
                <span className="text-slate-900 dark:text-white font-medium">
                  {doctor.hospitalName}
                </span>
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-sm">
                Experience:{" "}
                <span className="text-slate-900 dark:text-white font-medium">
                  {doctor.experience} Years
                </span>
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-sm">
                Consultation Fee:{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ${doctor.consultationFee}
                </span>
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-sm">
                Available Days:{" "}
                <span className="text-slate-900 dark:text-white font-medium">
                  {doctor.availableDays?.join(", ") ||
                    "Contact for availability"}
                </span>
              </p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700"></div>

            <div className="flex flex-wrap justify-end gap-3 mt-4">
              <Link
                href="/find-doctors"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors px-4 py-3"
              >
                Back
              </Link>

              {/* Trigger the Modal */}
              <button
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-6 py-3 font-medium transition-all"
                onClick={() =>
                  document.getElementById("booking_modal").showModal()
                }
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DaisyUI Booking Modal */}
      <dialog
        id="booking_modal"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-0 m-0 w-full max-w-none h-full max-h-none items-center justify-center open:flex"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 w-full max-w-md mx-4">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Book with {doctor.doctorName}
          </h3>

          <form onSubmit={handleBooking} className="space-y-4">
            <div className="form-control">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span>Select Date</span>
              </label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="form-control">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span>Select Time</span>
              </label>
              <input
                type="time"
                required
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mt-4">
              <p className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400 text-sm">
                  Consultation Fee:
                </span>{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                  ${doctor.consultationFee}
                </span>
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                Payment will be collected after doctor approval.
              </p>
            </div>

            {bookingMessage && (
              <div className="text-error text-sm mt-2">{bookingMessage}</div>
            )}

            <div className="modal-action mt-6">
              <button
                type="button"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                onClick={() => document.getElementById("booking_modal").close()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-6 py-2.5 font-medium transition-all"
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Confirm Booking Request"
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
