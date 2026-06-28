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

      {/* 6. Why Choose MediCare Connect (Static) */}
      <div className="py-20 bg-base-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-primary mb-6">
                Why Choose MediCare Connect?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We bring the clinic to your fingertips. Our platform is designed
                to eliminate long waiting room hours and complicated paperwork,
                offering a seamless and secure healthcare experience.
              </p>

              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-success text-xl">✔</span>
                  <strong>Verified Specialists:</strong> Every doctor on our
                  platform is thoroughly vetted by our admin team.
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-success text-xl">✔</span>
                  <strong>Secure Medical Records:</strong> Your prescriptions and
                  appointment history are safely stored.
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-success text-xl">✔</span>
                  <strong>Instant Online Booking:</strong> Pick a date and time
                  that works for you without calling the clinic.
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-success text-xl">✔</span>
                  <strong>Transparent Pricing:</strong> Know your consultation
                  fee upfront and pay securely online.
                </li>
              </ul>
            </div>

            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-primary text-primary-content p-6 rounded-xl shadow-lg text-center transform translate-y-4">
                <div className="text-4xl mb-2">⏱️</div>
                <h3 className="font-bold text-lg">Save Time</h3>
                <p className="text-sm opacity-80">Skip the waiting room</p>
              </div>
              <div className="bg-secondary text-secondary-content p-6 rounded-xl shadow-lg text-center">
                <div className="text-4xl mb-2">🔒</div>
                <h3 className="font-bold text-lg">Secure</h3>
                <p className="text-sm opacity-80">Data privacy first</p>
              </div>
              <div className="bg-accent text-accent-content p-6 rounded-xl shadow-lg text-center transform translate-y-4">
                <div className="text-4xl mb-2">👨‍⚕️</div>
                <h3 className="font-bold text-lg">Top Doctors</h3>
                <p className="text-sm opacity-80">Expert medical care</p>
              </div>
              <div className="bg-base-100 text-base-content p-6 rounded-xl shadow-lg border border-base-300 text-center">
                <div className="text-4xl mb-2">💻</div>
                <h3 className="font-bold text-lg">Digital</h3>
                <p className="text-sm opacity-80">Manage from anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
