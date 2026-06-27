"use client";

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
          `http://localhost:5001/api/doctors/${params.id}`,
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
      const response = await fetch("http://localhost:5001/api/appointments", {
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
    <div className="min-h-screen bg-base-200 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card lg:card-side bg-base-100 shadow-xl border border-base-300">
          <figure className="p-8 lg:w-1/3 flex justify-center bg-base-200">
            <img
              src={doctor.profileImage || "https://via.placeholder.com/300"}
              alt={doctor.doctorName}
              className="rounded-xl w-64 h-64 object-cover shadow-lg border-4 border-white"
            />
          </figure>

          <div className="card-body lg:w-2/3">
            <h2 className="card-title text-4xl font-bold text-primary mb-2">
              {doctor.doctorName}
            </h2>
            <div className="flex gap-2 mb-4">
              <span className="badge badge-secondary badge-lg">
                {doctor.specialization}
              </span>
              <span className="badge badge-outline badge-lg">Verified ✔</span>
            </div>

            <div className="space-y-3 text-lg mb-6">
              <p>
                <strong>Qualifications:</strong> {doctor.qualifications}
              </p>
              <p>
                <strong>Hospital:</strong> {doctor.hospitalName}
              </p>
              <p>
                <strong>Experience:</strong> {doctor.experience} Years
              </p>
              <p>
                <strong>Consultation Fee:</strong>{" "}
                <span className="text-success font-bold">
                  ${doctor.consultationFee}
                </span>
              </p>
              <p>
                <strong>Available Days:</strong>{" "}
                {doctor.availableDays?.join(", ") || "Contact for availability"}
              </p>
            </div>

            <div className="divider"></div>

            <div className="card-actions justify-end mt-4">
              <Link href="/find-doctors" className="btn btn-ghost mr-2">
                Back
              </Link>

              {/* Trigger the Modal */}
              <button
                className="btn btn-primary btn-lg px-8"
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
      <dialog id="booking_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-2xl text-primary mb-4">
            Book with {doctor.doctorName}
          </h3>

          <form onSubmit={handleBooking} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Select Date</span>
              </label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Select Time</span>
              </label>
              <input
                type="time"
                required
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="bg-base-200 p-4 rounded-lg mt-4">
              <p className="flex justify-between">
                <span>Consultation Fee:</span>{" "}
                <span className="font-bold text-success">
                  ${doctor.consultationFee}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Payment will be collected after doctor approval.
              </p>
            </div>

            {bookingMessage && (
              <div className="text-error text-sm mt-2">{bookingMessage}</div>
            )}

            <div className="modal-action mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => document.getElementById("booking_modal").close()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
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
