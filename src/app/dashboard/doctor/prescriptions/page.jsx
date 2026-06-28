"use client";

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
        "http://localhost:5001/api/appointments/doctor/requests",
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
        `http://localhost:5001/api/appointments/doctor/${selectedAppt._id}/prescription`,
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
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10">
      <h1 className="text-3xl font-bold text-primary mb-2">
        Patient Prescriptions
      </h1>
      <p className="text-gray-500 mb-8">
        Write medical notes and prescribe medicine for your confirmed patients.
      </p>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content text-sm">
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Prescription Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td className="font-bold">{appt.patientName || "Anonymous"}</td>
                <td>{appt.date || appt.appointmentDate}</td>
                <td>
                  {appt.prescription ? (
                    <span className="badge badge-success">Provided</span>
                  ) : (
                    <span className="badge badge-warning">Pending</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => openPrescriptionModal(appt)}
                    className="btn btn-sm btn-primary"
                  >
                    {appt.prescription
                      ? "Edit Prescription"
                      : "Write Prescription"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {appointments.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No approved appointments to prescribe for.
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              Prescription for {selectedAppt?.patientName || "Anonymous"}
            </h3>
            <form onSubmit={handleSavePrescription}>
              <div className="form-control mb-4">
                <textarea
                  className="textarea textarea-bordered w-full h-48"
                  placeholder="Enter medicines, dosage, and advice here..."
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="loading loading-spinner"></span>
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
