"use client";

import React, { useState } from "react";

export default function DeliveryMethod() {
  const [selectedMethod, setSelectedMethod] = useState("");

  const methods = [
    { id: "standard", label: "Standard Delivery" },
    { id: "express", label: "Express Delivery" },
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Delivery Method</h2>
      <div className="space-y-2">
        {methods.map((method) => (
          <label key={method.id} className="flex items-center space-x-2">
            <input
              type="radio"
              name="delivery"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => setSelectedMethod(method.id)}
              className="text-primary"
            />
            <span>{method.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}