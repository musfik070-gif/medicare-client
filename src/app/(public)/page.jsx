"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic data from our new backend route
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/home");
        const result = await response.json();
        if (result.success) {
          setHomeData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const specializations = [
    { name: "Cardiology", icon: "❤️" },
    { name: "Neurology", icon: "🧠" },
    { name: "Orthopedics", icon: "🦴" },
    { name: "Pediatrics", icon: "👶" },
    { name: "Dermatology", icon: "✨" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 1. Banner Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero min-h-[60vh] bg-base-200"
      >
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-primary">
              Your Health, Our Priority
            </h1>
            <p className="py-6 text-lg">
              MediCare Connect is a modern healthcare management platform that
              bridges the gap between patients and top-tier medical
              professionals.
            </p>
            <Link href="/find-doctors" className="btn btn-primary btn-lg">
              Find a Doctor Now
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 2. Dynamic Featured Doctors */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Doctors
          </h2>
          {homeData?.featuredDoctors?.length === 0 ? (
            <p className="text-center text-gray-500">
              More doctors joining soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {homeData?.featuredDoctors?.map((doctor) => (
                <div key={doctor._id} className="card bg-base-200 shadow-xl">
                  <figure className="px-10 pt-10">
                    <img
                      src={
                        doctor.profileImage || "https://via.placeholder.com/150"
                      }
                      alt={doctor.doctorName}
                      className="rounded-xl w-32 h-32 object-cover"
                    />
                  </figure>
                  <div className="card-body items-center text-center">
                    <h2 className="card-title">{doctor.doctorName}</h2>
                    <p className="text-sm font-semibold text-primary">
                      {doctor.specialization}
                    </p>
                    <p>Experience: {doctor.experience} years</p>
                    <p>Fee: ${doctor.consultationFee}</p>
                    <Link
                      href={`/doctor/${doctor._id}`}
                      className="btn btn-outline btn-primary mt-4 w-full"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Static Medical Specializations */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Our Specializations
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {specializations.map((spec, index) => (
              <div
                key={index}
                className="card w-48 bg-base-100 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-base-300"
              >
                <div className="card-body items-center text-center">
                  <span className="text-4xl mb-2">{spec.icon}</span>
                  <h3 className="card-title text-lg">{spec.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dynamic Platform Statistics */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stat bg-primary-focus rounded-xl shadow-lg border border-primary-content/20">
              <div className="stat-title text-primary-content/80">
                Total Doctors
              </div>
              <div className="stat-value text-4xl">
                {homeData?.stats?.totalDoctors || 0}
              </div>
            </div>
            <div className="stat bg-primary-focus rounded-xl shadow-lg border border-primary-content/20">
              <div className="stat-title text-primary-content/80">
                Total Patients
              </div>
              <div className="stat-value text-4xl">
                {homeData?.stats?.totalPatients || 0}
              </div>
            </div>
            <div className="stat bg-primary-focus rounded-xl shadow-lg border border-primary-content/20">
              <div className="stat-title text-primary-content/80">
                Appointments
              </div>
              <div className="stat-value text-4xl">
                {homeData?.stats?.totalAppointments || 0}
              </div>
            </div>
            <div className="stat bg-primary-focus rounded-xl shadow-lg border border-primary-content/20">
              <div className="stat-title text-primary-content/80">
                Total Reviews
              </div>
              <div className="stat-value text-4xl">
                {homeData?.stats?.totalReviews || 0}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Static Why Choose Us */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 bg-base-100"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">
            Why Choose MediCare Connect?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Zero Waiting Time</h3>
              <p className="text-gray-600">
                Book appointments instantly and skip the long hospital queues.
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-bold mb-2">Verified Doctors</h3>
              <p className="text-gray-600">
                Every doctor on our platform is strictly verified by our admin
                team.
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Your transactions and medical records are kept 100% secure.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
