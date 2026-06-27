"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/src/components/shared/Navbar";

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
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar />
      {/* 1. Banner Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero min-h-[68vh] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10"
      >
        <div className="hero-content text-center px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-primary">
              Your Health, Our Priority
            </h1>
            <p className="py-6 text-lg md:text-xl leading-relaxed text-base-content/70">
              MediCare Connect is a modern healthcare management platform that
              bridges the gap between patients and top-tier medical
              professionals.
            </p>
            <Link href="/find-doctors" className="btn btn-primary btn-lg shadow-lg shadow-primary/20">
              Find a Doctor Now
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 2. Dynamic Featured Doctors */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-base-content">
            Featured Doctors
          </h2>
          {homeData?.featuredDoctors?.length === 0 ? (
            <p className="text-center text-gray-500">
              More doctors joining soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {homeData?.featuredDoctors?.map((doctor) => (
                <div key={doctor._id} className="card bg-base-100 shadow-xl border border-base-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <figure className="px-10 pt-10 bg-gradient-to-b from-primary/10 to-transparent">
                    <img
                      src={
                        doctor.profileImage || "https://via.placeholder.com/150"
                      }
                      alt={doctor.doctorName}
                      className="rounded-2xl w-32 h-32 object-cover ring-4 ring-base-100 shadow-lg"
                    />
                  </figure>
                  <div className="card-body items-center text-center">
                    <h2 className="card-title text-xl font-bold">{doctor.doctorName}</h2>
                    <p className="badge badge-primary badge-outline">
                      {doctor.specialization}
                    </p>
                    <p className="text-sm text-base-content/70">Experience: {doctor.experience} years</p>
                    <p className="font-semibold text-success">Fee: ${doctor.consultationFee}</p>
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
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Our Specializations
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {specializations.map((spec, index) => (
              <div
                key={index}
                className="card w-48 bg-base-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-base-300"
              >
                <div className="card-body items-center text-center p-6">
                  <span className="text-4xl mb-2 rounded-full bg-primary/10 p-4">{spec.icon}</span>
                  <h3 className="card-title text-lg font-bold">{spec.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dynamic Platform Statistics */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12">Platform Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stat bg-primary-content/10 rounded-2xl shadow-lg border border-primary-content/20 backdrop-blur">
              <div className="stat-title text-primary-content/80">
                Total Doctors
              </div>
              <div className="stat-value text-4xl font-extrabold">
                {homeData?.stats?.totalDoctors || 0}
              </div>
            </div>
            <div className="stat bg-primary-content/10 rounded-2xl shadow-lg border border-primary-content/20 backdrop-blur">
              <div className="stat-title text-primary-content/80">
                Total Patients
              </div>
              <div className="stat-value text-4xl font-extrabold">
                {homeData?.stats?.totalPatients || 0}
              </div>
            </div>
            <div className="stat bg-primary-content/10 rounded-2xl shadow-lg border border-primary-content/20 backdrop-blur">
              <div className="stat-title text-primary-content/80">
                Appointments
              </div>
              <div className="stat-value text-4xl font-extrabold">
                {homeData?.stats?.totalAppointments || 0}
              </div>
            </div>
            <div className="stat bg-primary-content/10 rounded-2xl shadow-lg border border-primary-content/20 backdrop-blur">
              <div className="stat-title text-primary-content/80">
                Total Reviews
              </div>
              <div className="stat-value text-4xl font-extrabold">
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
        className="py-20 bg-base-100"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12">
            Why Choose MediCare Connect?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-base-200 bg-base-100 shadow-sm">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Zero Waiting Time</h3>
              <p className="text-base-content/65 leading-relaxed">
                Book appointments instantly and skip the long hospital queues.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-base-200 bg-base-100 shadow-sm">
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-bold mb-3">Verified Doctors</h3>
              <p className="text-base-content/65 leading-relaxed">
                Every doctor on our platform is strictly verified by our admin
                team.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-base-200 bg-base-100 shadow-sm">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
              <p className="text-base-content/65 leading-relaxed">
                Your transactions and medical records are kept 100% secure.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
