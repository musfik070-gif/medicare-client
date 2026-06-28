"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch doctors and include the current page in the URL
  const fetchDoctors = async (
    searchQuery = "",
    sortOption = "",
    currentPage = 1,
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/doctors?search=${searchQuery}&sort=${sortOption}&page=${currentPage}&limit=6`,
      );
      const result = await response.json();

      if (result.success) {
        setDoctors(result.data);
        setTotalPages(result.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when sort or page changes
  useEffect(() => {
    fetchDoctors(search, sort, page);
  }, [sort, page]);

  // Handle manual search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Always reset to page 1 on a fresh search
    fetchDoctors(search, sort, 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 font-sans transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest mb-2 block">
            OUR DOCTORS
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Find Your Doctor
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Search by name or specialization, and book your appointment today.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="card bg-white dark:bg-slate-800 shadow-sm mb-10 p-4 md:p-6 border border-slate-100 dark:border-slate-700 rounded-2xl">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <div className="form-control w-full md:w-2/3">
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <input
                  type="text"
                  placeholder="Search by name or specialization (e.g., Cardiology)..."
                  className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 dark:text-white placeholder-slate-400 text-sm min-h-[44px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-6 py-2.5 font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm min-h-[44px]">
                  Search
                </button>
              </div>
            </div>

            <div className="form-control w-full md:w-1/3">
              <select
                className="w-full border border-slate-200 dark:border-slate-650 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 text-sm min-h-[44px]"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Sort By (Default)</option>
                <option value="feeAsc">Fee: Low to High</option>
                <option value="feeDesc">Fee: High to Low</option>
                <option value="experienceDesc">Experience: High to Low</option>
                <option value="ratingDesc">Highest Rating</option>
              </select>
            </div>
          </form>
        </div>

        {/* Doctor Grid Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-sky-500"></span>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-500 dark:text-slate-300">
              No doctors found matching your criteria.
            </h2>
            <p className="mt-2 text-slate-400 dark:text-slate-500">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="card bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-2xl flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <figure className="px-8 pt-8 pb-4 bg-gradient-to-b from-sky-50/50 dark:from-sky-950/20 to-transparent flex justify-center">
                  <img
                    src={
                      doctor.profileImage || "https://via.placeholder.com/150"
                    }
                    alt={doctor.doctorName}
                    className="rounded-full w-28 h-28 object-cover ring-4 ring-sky-100 dark:ring-slate-700 shadow-md"
                  />
                </figure>
                <div className="card-body items-center text-center p-6 flex flex-col flex-grow">
                  <h2 className="card-title text-xl font-bold text-slate-800 dark:text-white mb-1">{doctor.doctorName}</h2>
                  <span className="badge bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-xs font-semibold px-3 py-1 rounded-full border border-sky-100 dark:border-sky-900 mb-4">
                    {doctor.specialization}
                  </span>

                  <div className="w-full text-left space-y-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 flex-grow mb-6">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <strong>Experience:</strong> {doctor.experience} Years
                    </p>
                    <p className="text-sm text-emerald-600 font-semibold flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <strong>Consultation Fee:</strong> ${doctor.consultationFee}
                    </p>
                  </div>

                  <div className="card-actions w-full mt-auto">
                    <Link
                      href={`/doctor/${doctor._id}`}
                      className="w-full text-center bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-2.5 font-semibold transition-all duration-200 text-sm shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination UI */}
        {!loading && doctors.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="join shadow-sm border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                className="join-item btn bg-white hover:bg-slate-50 border-r border-slate-200 text-slate-600 text-sm font-medium h-10 px-4 min-h-0"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                « Prev
              </button>

              <button className="join-item btn bg-sky-500 hover:bg-sky-500 text-white border-0 text-sm font-semibold h-10 px-4 min-h-0 cursor-default">
                Page {page} of {totalPages}
              </button>

              <button
                className="join-item btn bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium h-10 px-4 min-h-0"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
