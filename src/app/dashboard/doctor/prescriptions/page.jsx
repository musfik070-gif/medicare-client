"use client";

import { SERVER_URL } from "@/src/lib/api";

import React, { useEffect, useState } from "react";

export default function DoctorPrescriptionsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAppt, setSelectedAppt] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${SERVER_URL}/api/appointments/doctor/requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json();

      if (result.success) {
        // Only show Approved, Paid, or Completed appointments
        const validAppointments = result.data.filter(
          (appt) =>
            (appt.status || appt.appointmentStatus) === "Approved" ||
            (appt.status || appt.appointmentStatus) === "Paid" ||
            (appt.status || appt.appointmentStatus) === "Completed",
        );
        setAppointments(validAppointments);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openPrescriptionModal = (appt) => {
    setSelectedAppt(appt);
    setPrescriptionText(appt.prescription || "");
    setIsModalOpen(true);
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${SERVER_URL}/api/appointments/doctor/${selectedAppt._id}/prescription`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prescription: prescriptionText }),
        },
      );

      const result = await response.json();
      if (result.success) {
        alert("Prescription saved successfully!");
        setIsModalOpen(false);
        fetchAppointments();
      } else {
        alert("Failed to save prescription.");
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 font-sans">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Patient Prescriptions
      </h1>
      <p className="text-slate-500 text-base mb-8">
        Write medical notes and prescribe medicine for your confirmed patients.
      </p>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="py-4.5 px-6 font-semibold text-left">Patient</th>
              <th className="py-4.5 px-6 font-semibold text-left">Date</th>
              <th className="py-4.5 px-6 font-semibold text-left">Prescription Status</th>
              <th className="py-4.5 px-6 font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((appt) => (
              <tr key={appt._id} className="hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                <td className="py-4 px-6 font-bold text-slate-800">{appt.patientName || "Anonymous"}</td>
                <td className="py-4 px-6 text-slate-500">{appt.date || appt.appointmentDate}</td>
                <td className="py-4 px-6">
                  {appt.prescription ? (
                    <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">Provided</span>
                  ) : (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">Pending</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => openPrescriptionModal(appt)}
                    className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-2.5 py-1.5 md:px-3 text-xs font-semibold transition-all duration-200 shadow-sm flex items-center gap-1.5 min-h-[44px]"
                    title={appt.prescription ? "Edit Prescription" : "Write Prescription"}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden md:inline">
                      {appt.prescription ? "Edit" : "Prescribe"}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {appointments.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm bg-white">
            No approved appointments to prescribe for.
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      {isModalOpen && (
        <div className="modal modal-open bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="modal-box w-11/12 max-w-3xl bg-white rounded-2xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-slate-800 mb-4">
              Prescription for {selectedAppt?.patientName || "Anonymous"}
            </h3>
            <form onSubmit={handleSavePrescription} className="space-y-4">
              <div className="form-control">
                <textarea
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 text-sm h-48"
                  placeholder="Enter medicines, dosage, and advice here..."
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="modal-action gap-2 pt-2">
                <button
                  type="button"
                  className="border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-sm"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="loading loading-spinner text-white loading-sm"></span>
                  ) : (
                    "Save & Send"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
