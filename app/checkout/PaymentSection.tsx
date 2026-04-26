"use client";

import React, { useState } from "react";

export default function PaymentSection() {
  const [selectedPayment, setSelectedPayment] = useState("");

  const payments = [
    { id: "cod", label: "Cash on Delivery" },
    { id: "card", label: "Credit/Debit Card" },
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      <div className="space-y-2">
        {payments.map((payment) => (
          <label key={payment.id} className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value={payment.id}
              checked={selectedPayment === payment.id}
              onChange={() => setSelectedPayment(payment.id)}
              className="text-primary"
            />
            <span>{payment.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}