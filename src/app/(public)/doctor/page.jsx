"use client";

import { SERVER_URL } from "@/src/lib/api";

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

    if (params.id) {
      fetchDoctorDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 px-4 text-center">
        <h2 className="text-3xl font-extrabold text-error">Doctor Not Found</h2>
        <Link href="/find-doctors" className="btn btn-primary mt-4 shadow-lg shadow-primary/20">
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-base-200 to-base-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card lg:card-side bg-base-100 shadow-2xl border border-base-300 overflow-hidden">
          {/* Doctor Image */}
          <figure className="p-8 lg:w-1/3 flex justify-center bg-gradient-to-br from-primary/15 to-secondary/10">
            <img
              src={doctor.profileImage || "https://via.placeholder.com/300"}
              alt={doctor.doctorName}
              className="rounded-2xl w-64 h-64 object-cover shadow-xl border-4 border-base-100"
            />
          </figure>

          {/* Doctor Info */}
          <div className="card-body lg:w-2/3 p-8">
            <h2 className="card-title text-3xl md:text-4xl font-extrabold text-primary mb-2 leading-tight">
              {doctor.doctorName}
            </h2>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="badge badge-secondary badge-lg">
                {doctor.specialization}
              </span>
              <span className="badge badge-success badge-outline badge-lg">Verified ✔</span>
            </div>

            <div className="space-y-3 text-base md:text-lg mb-6 rounded-2xl bg-base-200/70 p-5">
              <p className="leading-relaxed">
                <strong>Qualifications:</strong> {doctor.qualifications}
              </p>
              <p className="leading-relaxed">
                <strong>Hospital:</strong> {doctor.hospitalName}
              </p>
              <p className="leading-relaxed">
                <strong>Experience:</strong> {doctor.experience} Years
              </p>
              <p className="leading-relaxed">
                <strong>Consultation Fee:</strong>{" "}
                <span className="text-success font-bold">
                  ${doctor.consultationFee}
                </span>
              </p>
              <p className="leading-relaxed">
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
              <button className="btn btn-primary btn-lg px-8 shadow-lg shadow-primary/20">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
