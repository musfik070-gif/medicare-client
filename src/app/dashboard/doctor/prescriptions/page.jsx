"use client";

import React, { useEffect, useState } from "react";

export default function DoctorPrescriptionsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Prescription Modal State
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState("");
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
        // Only show Paid (ready for consultation) or Completed (already consulted) appointments
        const validAppointments = result.data.filter(
          (appt) => appt.status === "Paid" || appt.status === "Completed",
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
    setPrescriptionText(appt.prescription || ""); // Load existing if any
    document.getElementById("prescription_modal").showModal();
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
        document.getElementById("prescription_modal").close();
        fetchAppointments(); // Refresh to show "Completed" status
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
              <th>Patient Name</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td className="font-bold">{appt.patientName}</td>
                <td>
                  <div className="font-semibold">{appt.date}</div>
                  <div className="text-sm opacity-70">{appt.time}</div>
                </td>
                <td>
                  <span
                    className={`badge ${appt.status === "Completed" ? "badge-success" : "badge-info"}`}
                  >
                    {appt.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => openPrescriptionModal(appt)}
                    className={`btn btn-sm ${appt.status === "Completed" ? "btn-outline" : "btn-primary"}`}
                  >
                    {appt.status === "Completed"
                      ? "View/Edit Notes"
                      : "Write Prescription"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {appointments.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No paid or completed appointments available for prescriptions.
          </div>
        )}
      </div>

      {/* DaisyUI Prescription Modal */}
      <dialog
        id="prescription_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box w-11/12 max-w-3xl">
          <h3 className="font-bold text-2xl text-primary mb-4">
            Medical Notes: {selectedAppt?.patientName}
          </h3>

          <div className="bg-base-200 p-3 rounded-lg mb-4 text-sm">
            <strong>Appointment:</strong> {selectedAppt?.date} at{" "}
            {selectedAppt?.time}
          </div>

          <form onSubmit={handleSavePrescription}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Prescription & Advice
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-48 w-full text-base"
                placeholder="Write medicines, dosages, and medical advice here..."
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="modal-action mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  document.getElementById("prescription_modal").close()
                }
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-8"
                disabled={saving}
              >
                {saving ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Save & Complete Appointment"
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button disabled={saving}>close</button>
        </form>
      </dialog>
    </div>
  );
}
