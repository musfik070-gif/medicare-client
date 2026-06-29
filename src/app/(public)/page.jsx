"use client";

import { SERVER_URL } from "@/src/lib/api";

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
        const homeResponse = await fetch(`${SERVER_URL}/api/home`);
        const homeResult = await homeResponse.json();
        if (homeResult.success) {
          setHomeData(homeResult.data);
        }

        const reviewsResponse = await fetch(
          `${SERVER_URL}/api/reviews/all`,
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
      <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <span className="loading loading-spinner loading-lg text-sky-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-sans transition-colors duration-200">
      <Navbar />
      {/* 1. Animated Hero Section */}
      <motion.div
        className="hero min-h-[75vh] bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"></div>
        <div className="hero-content text-center relative z-10 py-16 px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest mb-4 block">
              WELCOME TO MEDICARE CONNECT
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              <span className="text-sky-500">Your Health,</span> <span className="text-sky-500">Our Priority</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with top-rated medical specialists from the comfort of
              your home. Book appointments, manage your health records, and get
              the secure care you deserve.
            </p>
            <Link
              href="/find-doctors"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8 py-3.5 font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-base"
            >
              Book an Appointment
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. Animated Featured Doctors Section */}
      <motion.div
        className="py-12 md:py-20 bg-white dark:bg-slate-800 transition-colors duration-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest mb-2 block">
              MEET OUR TEAM
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Featured Specialists
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
              Access highly recommended healthcare practitioners with verified reviews and proven experiences.
            </p>
          </div>

          {homeData?.featuredDoctors?.length === 0 ? (
            <p className="text-center text-slate-400 py-12 text-sm">
              More doctors joining soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeData?.featuredDoctors?.map((doctor) => (
                <div
                  key={doctor._id}
                  className="card bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden"
                >
                  <figure className="px-8 pt-8 pb-4 bg-gradient-to-b from-sky-50/50 dark:from-sky-950/20 to-transparent flex justify-center">
                    <img
                      src={
                        doctor.profileImage || "https://via.placeholder.com/150"
                      }
                      alt={doctor.doctorName}
                      className="rounded-full w-28 h-28 object-cover ring-4 ring-sky-100 dark:ring-slate-800 shadow-md"
                    />
                  </figure>
                  <div className="card-body items-center text-center p-6 flex flex-col flex-grow">
                    <h2 className="card-title text-xl font-bold text-slate-800 dark:text-white mb-1">
                      {doctor.doctorName}
                    </h2>
                    <span className="badge bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-xs font-semibold px-3 py-1 rounded-full border border-sky-100 dark:border-sky-900 mb-3">
                      {doctor.specialization}
                    </span>
                    <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">
                      <p className="flex items-center justify-center gap-1.5">
                        <span>Experience:</span>
                        <strong className="text-slate-700 dark:text-slate-300">{doctor.experience} years</strong>
                      </p>
                      <p className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-450 font-semibold bg-emerald-50/50 dark:bg-emerald-950/20 px-3 py-1 rounded-lg border border-emerald-100/50 dark:border-emerald-900/50 mt-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Fee: ${doctor.consultationFee}
                      </p>
                    </div>
                    <Link
                      href={`/doctor/${doctor._id}`}
                      className="w-full text-center border border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/30 rounded-xl py-2.5 font-semibold transition-all duration-200 text-sm mt-auto"
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
      <div className="py-12 md:py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="mb-12">
            <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest mb-2 block">
              OUR DEPARTMENTS
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Our Medical Specializations
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
              Find expert care across a wide range of medical fields. Our platform
              connects you with top-rated specialists in these key departments.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-4">
            <div className="card w-40 sm:w-44 lg:w-48 flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:shadow-md py-8 cursor-pointer group rounded-2xl">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">❤️</div>
              <h3 className="font-bold text-lg group-hover:text-white dark:group-hover:text-white text-slate-800 dark:text-white transition-colors">Cardiology</h3>
            </div>

            <div className="card w-40 sm:w-44 lg:w-48 flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:shadow-md py-8 cursor-pointer group rounded-2xl">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">🧠</div>
              <h3 className="font-bold text-lg group-hover:text-white dark:group-hover:text-white text-slate-800 dark:text-white transition-colors">Neurology</h3>
            </div>

            <div className="card w-40 sm:w-44 lg:w-48 flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:shadow-md py-8 cursor-pointer group rounded-2xl">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">🦴</div>
              <h3 className="font-bold text-lg group-hover:text-white dark:group-hover:text-white text-slate-800 dark:text-white transition-colors">Orthopedics</h3>
            </div>

            <div className="card w-40 sm:w-44 lg:w-48 flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:shadow-md py-8 cursor-pointer group rounded-2xl">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">🧸</div>
              <h3 className="font-bold text-lg group-hover:text-white dark:group-hover:text-white text-slate-800 dark:text-white transition-colors">Pediatrics</h3>
            </div>

            <div className="card w-40 sm:w-44 lg:w-48 flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:shadow-md py-8 cursor-pointer group rounded-2xl">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">✨</div>
              <h3 className="font-bold text-lg group-hover:text-white dark:group-hover:text-white text-slate-800 dark:text-white transition-colors">Dermatology</h3>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Dynamic Patient Success Stories Section */}
      <motion.div
        className="py-12 md:py-20 bg-white dark:bg-slate-800 transition-colors duration-200"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest mb-2 block">
              PATIENT TESTIMONIALS
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Patient Success Stories
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
              Read what our patients have to say about their experiences with our
              top-rated specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="card bg-slate-50 dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-slate-100 dark:border-slate-800 flex flex-col h-full rounded-2xl"
              >
                <div className="flex text-amber-400 gap-0.5 mb-4 text-base">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic text-sm mb-6 flex-grow leading-relaxed">
                  "{review.comment.length > 100
                    ? review.comment.substring(0, 100) + "..."
                    : review.comment}"
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="avatar placeholder">
                    <div className="bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-full w-10 h-10 flex items-center justify-center font-bold border border-sky-100 dark:border-sky-900 text-sm">
                      <span>{review.patientName?.charAt(0) || "P"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{review.patientName}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Consulted Dr. {review.doctorName}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-slate-400 py-8">
                No reviews available yet. Be the first to share your experience!
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 5. Dynamic Platform Statistics */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-sky-600 to-sky-800 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent)] pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
          <span className="text-sky-200 text-sm font-semibold uppercase tracking-widest mb-3 block">
            GROWING STRONG
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-12 tracking-tight">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stat bg-white/10 rounded-2xl shadow-sm border border-white/10 p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1">
              <div className="stat-title text-sky-100/80 text-sm font-medium">
                Total Doctors
              </div>
              <div className="stat-value text-4xl font-extrabold mt-2 text-white">
                {homeData?.stats?.totalDoctors || 0}
              </div>
            </div>
            <div className="stat bg-white/10 rounded-2xl shadow-sm border border-white/10 p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1">
              <div className="stat-title text-sky-100/80 text-sm font-medium">
                Total Patients
              </div>
              <div className="stat-value text-4xl font-extrabold mt-2 text-white">
                {homeData?.stats?.totalPatients || 0}
              </div>
            </div>
            <div className="stat bg-white/10 rounded-2xl shadow-sm border border-white/10 p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1">
              <div className="stat-title text-sky-100/80 text-sm font-medium">
                Appointments
              </div>
              <div className="stat-value text-4xl font-extrabold mt-2 text-white">
                {homeData?.stats?.totalAppointments || 0}
              </div>
            </div>
            <div className="stat bg-white/10 rounded-2xl shadow-sm border border-white/10 p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1">
              <div className="stat-title text-sky-100/80 text-sm font-medium">
                Total Reviews
              </div>
              <div className="stat-value text-4xl font-extrabold mt-2 text-white">
                {homeData?.stats?.totalReviews || 0}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Choose MediCare Connect (Static) */}
      <div className="py-12 md:py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest mb-2 block">
                CONVENIENT CARE
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Why Choose MediCare Connect?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-350 mb-8 leading-relaxed">
                We bring the clinic to your fingertips. Our platform is designed
                to eliminate long waiting room hours and complicated paperwork,
                offering a seamless and secure healthcare experience.
              </p>

              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 w-7 h-7 flex items-center justify-center rounded-full text-base font-bold shadow-sm border border-emerald-100 dark:border-emerald-900">✔</span>
                  <span><strong className="text-slate-800 dark:text-slate-200">Verified Specialists:</strong> Every doctor on our platform is thoroughly vetted.</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 w-7 h-7 flex items-center justify-center rounded-full text-base font-bold shadow-sm border border-emerald-100 dark:border-emerald-900">✔</span>
                  <span><strong className="text-slate-800 dark:text-slate-200">Secure Medical Records:</strong> Your health records are safely stored.</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 w-7 h-7 flex items-center justify-center rounded-full text-base font-bold shadow-sm border border-emerald-100 dark:border-emerald-900">✔</span>
                  <span><strong className="text-slate-800 dark:text-slate-200">Instant Online Booking:</strong> Pick a date and time that works for you.</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 w-7 h-7 flex items-center justify-center rounded-full text-base font-bold shadow-sm border border-emerald-100 dark:border-emerald-900">✔</span>
                  <span><strong className="text-slate-800 dark:text-slate-200">Transparent Pricing:</strong> Know your consultation fee upfront.</span>
                </li>
              </ul>
            </div>

            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-sky-500 text-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-center transform translate-y-4">
                <div className="text-4xl mb-2">⏱️</div>
                <h3 className="font-bold text-lg mb-1">Save Time</h3>
                <p className="text-sm opacity-90">Skip the waiting room</p>
              </div>
              <div className="bg-emerald-500 text-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-center">
                <div className="text-4xl mb-2">🔒</div>
                <h3 className="font-bold text-lg mb-1">Secure</h3>
                <p className="text-sm opacity-90">Data privacy first</p>
              </div>
              <div className="bg-sky-600 text-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-center transform translate-y-4">
                <div className="text-4xl mb-2">👨‍⚕️</div>
                <h3 className="font-bold text-lg mb-1">Top Doctors</h3>
                <p className="text-sm opacity-90">Expert medical care</p>
              </div>
              <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 transition-all duration-200 text-center">
                <div className="text-4xl mb-2">💻</div>
                <h3 className="font-bold text-lg mb-1">Digital</h3>
                <p className="text-sm text-slate-500">Manage from anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
