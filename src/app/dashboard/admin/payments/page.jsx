"use client";

import { SERVER_URL } from "@/src/lib/api";

import React, { useEffect, useState } from "react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${SERVER_URL}/api/payments/admin/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const result = await response.json();

        if (result.success) {
          setPayments(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Calculate total platform revenue
  const totalRevenue = payments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0,
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Payment Records
          </h1>
          <p className="text-slate-500 text-base">
            Platform-wide overview of all financial transactions.
          </p>
        </div>
        <div className="bg-sky-50 border border-sky-100 rounded-2xl px-6 py-4 shadow-sm min-w-[200px]">
          <div className="text-sm font-medium text-slate-500">
            Total Revenue
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-1">${totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="py-4.5 px-6 font-semibold text-left">Transaction ID</th>
              <th className="py-4.5 px-6 font-semibold text-left">Patient</th>
              <th className="py-4.5 px-6 font-semibold text-left">Doctor</th>
              <th className="py-4.5 px-6 font-semibold text-left">Amount</th>
              <th className="py-4.5 px-6 font-semibold text-left">Date</th>
              <th className="py-4.5 px-6 font-semibold text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                <td className="py-4 px-6 font-mono text-xs text-slate-400">
                  {payment.transactionId || "N/A"}
                </td>
                <td className="py-4 px-6 font-semibold text-slate-800">{payment.patientName}</td>
                <td className="py-4 px-6 text-slate-600">{payment.doctorName}</td>
                <td className="py-4 px-6 font-bold text-emerald-600">${payment.amount}</td>
                <td className="py-4 px-6 text-slate-500">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase border ${
                      payment.status === "Paid"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {payment.status || "Completed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm bg-white">
            No transactions found on the platform yet.
          </div>
        )}
      </div>
    </div>
  );
}
