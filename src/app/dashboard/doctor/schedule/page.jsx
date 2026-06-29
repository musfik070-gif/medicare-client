"use client";

import { SERVER_URL } from "@/src/lib/api";
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
        const res = await fetch(`${SERVER_URL}/api/doctors/profile/me`, {
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
      const res = await fetch(`${SERVER_URL}/api/doctors/profile/me`, {
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 font-sans max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Manage Available Slots</h2>

      {/* Add Schedule */}
      <div className="flex gap-3 mb-8">
        <input
          type="time"
          className="border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 text-sm"
          value={newSlot}
          onChange={(e) => setNewSlot(e.target.value)}
        />
        <button onClick={handleAddSlot} className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-5 py-2 font-semibold transition-all duration-200 shadow-sm text-sm">
          Add Slot
        </button>
      </div>

      {/* Existing Schedule (Update/Remove) */}
      <div className="space-y-4 mb-8">
        {slots.map((s) => (
          <div key={s} className="flex flex-wrap items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
            {editingSlot === s ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="time"
                  className="border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-slate-800 text-sm"
                  value={updatedSlot}
                  onChange={(e) => setUpdatedSlot(e.target.value)}
                />
                <button onClick={updateSlot} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200">
                  Update
                </button>
                <button
                  onClick={() => setEditingSlot(null)}
                  className="text-slate-500 hover:text-slate-700 font-semibold px-2 py-1.5 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="bg-sky-50 text-sky-700 border border-sky-100 text-sm font-semibold px-4 py-1.5 rounded-lg">{s}</span>
                <button
                  onClick={() => startUpdateSlot(s)}
                  className="border border-sky-500 text-sky-500 hover:bg-sky-50/50 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                >
                  Update
                </button>
                <button
                  onClick={() => removeSlot(s)}
                  className="border border-red-500 text-red-500 hover:bg-red-50/50 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
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
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-sm"
        disabled={saving}
      >
        {saving ? <span className="loading loading-spinner text-white loading-sm"></span> : "Save Schedule"}
      </button>
    </div>
  );
}
