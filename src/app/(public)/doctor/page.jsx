"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function DoctorDetailsPage() {
  const params = useParams(); // Grabs the [id] from the URL
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

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

    if (params.id) {
      fetchDoctorDetails();
    }
  }, [params.id]);

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
          {/* Doctor Image */}
          <figure className="p-8 lg:w-1/3 flex justify-center bg-base-200">
            <img
              src={doctor.profileImage || "https://via.placeholder.com/300"}
              alt={doctor.doctorName}
              className="rounded-xl w-64 h-64 object-cover shadow-lg border-4 border-white"
            />
          </figure>

          {/* Doctor Info */}
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
              {/* Step 21 Placeholder: Booking functionality goes here later */}
              <button className="btn btn-primary btn-lg px-8">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
