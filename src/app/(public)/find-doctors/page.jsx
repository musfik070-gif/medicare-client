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
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-base-200 to-base-100 py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
            Find Your Doctor
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Search by name or specialization, and book your appointment today.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="card bg-base-100 shadow-xl mb-10 p-6 border border-base-300">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <div className="form-control w-full md:w-2/3">
              <div className="input-group flex w-full">
                <input
                  type="text"
                  placeholder="Search by name or specialization (e.g., Cardiology)..."
                  className="input input-bordered w-full focus:input-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-primary ml-2 shadow-md shadow-primary/20">
                  Search
                </button>
              </div>
            </div>

            <div className="form-control w-full md:w-1/3 mt-4 md:mt-0">
              <select
                className="select select-bordered w-full focus:select-primary"
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
              </select>
            </div>
          </form>
        </div>

        {/* Doctor Grid Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-2xl border border-base-300 shadow-sm">
            <h2 className="text-2xl font-semibold text-base-content/60">
              No doctors found matching your criteria.
            </h2>
            <p className="mt-2 text-base-content/45">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="card bg-base-100 shadow-xl border border-base-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <figure className="px-10 pt-10 bg-gradient-to-b from-primary/10 to-transparent">
                  <img
                    src={
                      doctor.profileImage || "https://via.placeholder.com/150"
                    }
                    alt={doctor.doctorName}
                    className="rounded-full w-32 h-32 object-cover border-4 border-base-100 ring-2 ring-primary/30 shadow-lg"
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title text-xl font-bold">{doctor.doctorName}</h2>
                  <div className="badge badge-primary badge-outline mb-2">
                    {doctor.specialization}
                  </div>

                  <div className="w-full text-left mt-4 space-y-2 rounded-xl bg-base-200/70 p-4">
                    <p className="text-sm">
                      <strong>Experience:</strong> {doctor.experience} Years
                    </p>
                    <p className="text-sm">
                      <strong>Consultation Fee:</strong> $
                      {doctor.consultationFee}
                    </p>
                  </div>

                  <div className="card-actions mt-4 w-full">
                    <Link
                      href={`/doctor/${doctor._id}`}
                      className="btn btn-primary w-full shadow-md shadow-primary/20"
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
            <div className="join shadow-md">
              <button
                className="join-item btn btn-outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                « Prev
              </button>

              <button className="join-item btn cursor-default btn-primary">
                Page {page} of {totalPages}
              </button>

              <button
                className="join-item btn btn-outline"
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
