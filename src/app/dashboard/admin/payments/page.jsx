"use client";

import React, { useEffect, useState } from "react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5001/api/payments/admin/all",
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
    <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Payment Records
          </h1>
          <p className="text-gray-500">
            Platform-wide overview of all financial transactions.
          </p>
        </div>
        <div className="stat bg-primary text-primary-content rounded-xl shadow w-auto px-6 py-2">
          <div className="stat-title text-primary-content/80">
            Total Revenue
          </div>
          <div className="stat-value text-2xl">${totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content text-sm">
            <tr>
              <th>Transaction ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="font-mono text-xs">
                  {payment.transactionId || "N/A"}
                </td>
                <td className="font-semibold">{payment.patientName}</td>
                <td>{payment.doctorName}</td>
                <td className="font-bold text-success">${payment.amount}</td>
                <td className="text-sm">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <span
                    className={`badge badge-sm ${
                      payment.status === "Paid"
                        ? "badge-success"
                        : "badge-warning"
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
          <div className="text-center py-10 text-gray-500">
            No transactions found on the platform yet.
          </div>
        )}
      </div>
    </div>
  );
}
