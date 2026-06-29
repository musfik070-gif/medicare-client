"use client";

import { SERVER_URL } from "@/src/lib/api";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function PatientPaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${SERVER_URL}/api/payments/patient/history`,
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Payment History
          </h1>
          <p className="text-slate-500 text-base">
            View your transaction receipts and billing history.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="py-4.5 px-6 font-semibold text-left">Date</th>
              <th className="py-4.5 px-6 font-semibold text-left">Doctor</th>
              <th className="py-4.5 px-6 font-semibold text-left">Transaction ID</th>
              <th className="py-4.5 px-6 font-semibold text-left">Amount</th>
              <th className="py-4.5 px-6 font-semibold text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                <td className="py-4 px-6 font-medium text-slate-500">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 font-semibold text-slate-800">{payment.doctorName}</td>
                <td className="py-4 px-6 font-mono text-xs text-slate-400">
                  {payment.transactionId}
                </td>
                <td className="py-4 px-6 font-mono font-bold text-emerald-600">
                  ${payment.amount}
                </td>
                <td className="py-4 px-6">
                  <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <div className="text-center py-12 px-4 bg-white">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No payment history found.
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              You haven't made any payments on the platform yet.
            </p>
            <Link
              href="/dashboard/patient/appointments"
              className="inline-flex items-center gap-2 border border-sky-500 text-sky-500 hover:bg-sky-50 rounded-xl px-5 py-2.5 font-semibold transition-all duration-200 text-sm"
            >
              View Appointments
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
