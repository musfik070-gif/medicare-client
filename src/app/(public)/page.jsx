"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/src/components/shared/Navbar";
import Footer from "@/src/components/shared/Footer";

export default function HomePage() {
  const [homeData, setHomeData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic data from our new backend route
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const homeResponse = await fetch("http://localhost:5001/api/home");
        const homeResult = await homeResponse.json();
        if (homeResult.success) {
          setHomeData(homeResult.data);
        }

        const reviewsResponse = await fetch(
          "http://localhost:5001/api/reviews/all",
        );
        const reviewsResult = await reviewsResponse.json();
        if (reviewsResult.success) {
          setReviews(reviewsResult.data);
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
      {/* 1. Animated Hero Section */}
      <motion.div
        className="hero min-h-[70vh] bg-base-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-primary mb-6">
              Your Health, Our Priority
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect with top-rated medical specialists from the comfort of
              your home. Book appointments, manage your health records, and get
              the secure care you deserve.
            </p>
            <Link
              href="/find-doctors"
              className="btn btn-primary btn-lg shadow-lg"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. Animated Featured Doctors Section */}
      <motion.div
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            Featured Specialists
          </h2>

          {homeData?.featuredDoctors?.length === 0 ? (
            <p className="text-center text-gray-500">
              More doctors joining soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {homeData?.featuredDoctors?.map((doctor) => (
                <div
                  key={doctor._id}
                  className="card bg-base-100 shadow-xl border border-base-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
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
                    <h2 className="card-title text-xl font-bold">
                      {doctor.doctorName}
                    </h2>
                    <p className="badge badge-primary badge-outline">
                      {doctor.specialization}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Experience: {doctor.experience} years
                    </p>
                    <p className="font-semibold text-success">
                      Fee: ${doctor.consultationFee}
                    </p>
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
      </motion.div>

      {/* 3. Medical Specializations Section (Static) */}
      <div className="py-20 bg-base-200">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Our Medical Specializations
          </h2>
          <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
            Find expert care across a wide range of medical fields. Our platform
            connects you with top-rated specialists in these key departments.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow py-8">
              <div className="text-4xl mb-4 text-error">❤️</div>
              <h3 className="font-bold text-lg">Cardiology</h3>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow py-8">
              <div className="text-4xl mb-4 text-info">🧠</div>
              <h3 className="font-bold text-lg">Neurology</h3>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow py-8">
              <div className="text-4xl mb-4 text-warning">🦴</div>
              <h3 className="font-bold text-lg">Orthopedics</h3>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow py-8">
              <div className="text-4xl mb-4 text-success">🧸</div>
              <h3 className="font-bold text-lg">Pediatrics</h3>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow py-8">
              <div className="text-4xl mb-4 text-secondary">✨</div>
              <h3 className="font-bold text-lg">Dermatology</h3>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Dynamic Patient Success Stories Section */}
      <motion.div
        className="py-20 bg-base-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-primary mb-4">
            Patient Success Stories
          </h2>
          <p className="text-gray-500 mb-12 max-w-2xl mx-auto text-center">
            Read what our patients have to say about their experiences with our
            top-rated specialists.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="card bg-base-200 shadow-md p-6 border border-base-300"
              >
                <div className="flex text-warning mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                  ))}
                </div>
                <p className="italic text-gray-600 mb-6 flex-grow">
                  "
                  {review.comment.length > 100
                    ? review.comment.substring(0, 100) + "..."
                    : review.comment}
                  "
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                      <span>{review.patientName?.charAt(0) || "P"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{review.patientName}</h4>
                    <p className="text-xs text-gray-500">
                      Consulted Dr. {review.doctorName}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-gray-500 py-8">
                No reviews available yet. Be the first to share your experience!
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 5. Dynamic Platform Statistics */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12">
            Platform Statistics
          </h2>
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
      <Footer />
    </div>
  );
}
