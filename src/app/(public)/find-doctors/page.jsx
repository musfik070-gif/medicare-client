"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  // Function to fetch data from our backend
  const fetchDoctors = async (searchQuery = "", sortOption = "") => {
    setLoading(true);
    try {
      // Notice how we pass the search and sort directly into the URL!
      const response = await fetch(
        `http://localhost:5001/api/doctors?search=${searchQuery}&sort=${sortOption}`,
      );
      const result = await response.json();

      if (result.success) {
        setDoctors(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Fetch doctors when the page first loads AND whenever the "sort" dropdown changes
  useEffect(() => {
    fetchDoctors(search, sort);
  }, [sort]);

  // 2. Fetch doctors ONLY when the user clicks the "Search" button
  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(search, sort);
  };

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Find Your Doctor
          </h1>
          <p className="text-lg text-gray-600">
            Search by name or specialization, and book your appointment today.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="card bg-base-100 shadow-xl mb-10 p-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            {/* Search Bar */}
            <div className="form-control w-full md:w-1/2">
              <div className="input-group flex w-full">
                <input
                  type="text"
                  placeholder="Search by name or specialization (e.g., Cardiology)..."
                  className="input input-bordered w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-primary ml-2">
                  Search
                </button>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="form-control w-full md:w-1/4 mt-4 md:mt-0">
              <select
                className="select select-bordered w-full"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
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
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-500">
              No doctors found matching your criteria.
            </h2>
            <p className="mt-2 text-gray-400">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="card bg-base-100 shadow-xl border border-base-300"
              >
                <figure className="px-10 pt-10">
                  <img
                    src={
                      doctor.profileImage || "https://via.placeholder.com/150"
                    }
                    alt={doctor.doctorName}
                    className="rounded-full w-32 h-32 object-cover border-4 border-primary shadow-sm"
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title text-xl">{doctor.doctorName}</h2>
                  <div className="badge badge-primary badge-outline mb-2">
                    {doctor.specialization}
                  </div>

                  <div className="w-full text-left mt-4 space-y-2">
                    <p>
                      <strong>Experience:</strong> {doctor.experience} Years
                    </p>
                    <p>
                      <strong>Consultation Fee:</strong> $
                      {doctor.consultationFee}
                    </p>
                    <p>
                      <strong>Available Days:</strong>{" "}
                      {doctor.availableDays?.join(", ") || "N/A"}
                    </p>
                  </div>

                  <div className="card-actions mt-4 w-full">
                    <Link
                      href={`/doctor/${doctor._id}`}
                      className="btn btn-primary w-full"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 8 Placeholder: Pagination will go here next! */}
      </div>
    </div>
  );
}
