"use client";
import React, { useState, useEffect } from "react";

export default function ManageSchedulePage() {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState("");
  const [editingSlot, setEditingSlot] = useState(null);
  const [updatedSlot, setUpdatedSlot] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing slots when page loads
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/doctors/profile/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success && data.data.availableSlots) {
          setSlots(data.data.availableSlots);
        }
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const handleAddSlot = () => {
    if (newSlot && !slots.includes(newSlot)) {
      setSlots([...slots, newSlot]);
      setNewSlot("");
    }
  };

  const removeSlot = (slotToRemove) => {
    setSlots(slots.filter((s) => s !== slotToRemove));
  };

  const startUpdateSlot = (slot) => {
    setEditingSlot(slot);
    setUpdatedSlot(slot);
  };

  const updateSlot = () => {
    if (!updatedSlot || slots.includes(updatedSlot)) return;
    setSlots(slots.map((slot) => (slot === editingSlot ? updatedSlot : slot)));
    setEditingSlot(null);
    setUpdatedSlot("");
  };

  const saveSchedule = async () => {
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5001/api/doctors/profile/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ availableSlots: slots }),
      });
      if ((await res.json()).success) alert("Schedule saved successfully!");
      else alert("Failed to save schedule.");
    } catch (error) {
      console.error("Failed to save schedule:", error);
      alert("Failed to save schedule.");
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
    <div className="bg-base-100 p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Manage Available Slots</h2>

      {/* Add Schedule */}
      <div className="flex gap-2 mb-6">
        <input
          type="time"
          className="input input-bordered"
          value={newSlot}
          onChange={(e) => setNewSlot(e.target.value)}
        />
        <button onClick={handleAddSlot} className="btn btn-primary">
          Add Slot
        </button>
      </div>

      {/* Existing Schedule (Update/Remove) */}
      <div className="space-y-3 mb-8">
        {slots.map((s) => (
          <div key={s} className="flex flex-wrap items-center gap-2">
            {editingSlot === s ? (
              <>
                <input
                  type="time"
                  className="input input-bordered input-sm"
                  value={updatedSlot}
                  onChange={(e) => setUpdatedSlot(e.target.value)}
                />
                <button onClick={updateSlot} className="btn btn-sm btn-success">
                  Update
                </button>
                <button
                  onClick={() => setEditingSlot(null)}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="badge badge-lg badge-info p-4">{s}</span>
                <button
                  onClick={() => startUpdateSlot(s)}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  Update
                </button>
                <button
                  onClick={() => removeSlot(s)}
                  className="btn btn-sm btn-outline btn-error"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={saveSchedule}
        className="btn btn-success w-full"
        disabled={saving}
      >
        {saving ? <span className="loading loading-spinner"></span> : "Save Schedule"}
      </button>
    </div>
  );
}
