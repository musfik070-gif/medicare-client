"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  // Static Data for Specializations
  const specializations = [
    { name: "Cardiology", icon: "❤️" },
    { name: "Neurology", icon: "🧠" },
    { name: "Orthopedics", icon: "🦴" },
    { name: "Pediatrics", icon: "👶" },
    { name: "Dermatology", icon: "✨" },
  ];

  return (
    <div className="min-h-screen">
      {/* 1. Banner Section (Animated) */}
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
              professionals. Book your appointment today.
            </p>
            <Link href="/find-doctors" className="btn btn-primary btn-lg">
              Find a Doctor Now
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Placeholder for Step 6: Dynamic Featured Doctors */}
      <section className="py-16 bg-base-100 text-center">
        <h2 className="text-3xl font-bold mb-8">Featured Doctors</h2>
        <p className="text-gray-500 italic">
          Dynamic data will be loaded here in Step 6...
        </p>
      </section>

      {/* 2. Medical Specializations (Static) */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Our Specializations
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {specializations.map((spec, index) => (
              <div
                key={index}
                className="card w-48 bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
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

      {/* Placeholder for Step 6: Dynamic Platform Stats */}
      <section className="py-16 bg-base-100 text-center">
        <h2 className="text-3xl font-bold mb-8">Platform Statistics</h2>
        <p className="text-gray-500 italic">
          Dynamic stats will be loaded here in Step 6...
        </p>
      </section>

      {/* 3. Why Choose MediCare Connect (Static & Animated) */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 bg-primary text-primary-content"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">
            Why Choose MediCare Connect?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Zero Waiting Time</h3>
              <p>
                Book appointments instantly and skip the long hospital queues.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Verified Doctors</h3>
              <p>
                Every doctor on our platform is strictly verified by our admin
                team.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p>Your transactions and medical records are kept 100% secure.</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
