"use client";

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
          "http://localhost:5001/api/payments/patient/history",
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
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Payment History
          </h1>
          <p className="text-gray-500">
            View your transaction receipts and billing history.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content text-sm">
            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="font-medium">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className="font-bold">{payment.doctorName}</td>
                <td className="font-mono text-xs opacity-70">
                  {payment.transactionId}
                </td>
                <td className="font-mono font-bold text-success">
                  ${payment.amount}
                </td>
                <td>
                  <span className="badge badge-success badge-sm">
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No payment history found.
            </h3>
            <p className="text-gray-400 mb-6">
              You haven't made any payments on the platform yet.
            </p>
            <Link
              href="/dashboard/patient/appointments"
              className="btn btn-outline btn-primary"
            >
              View Appointments
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
