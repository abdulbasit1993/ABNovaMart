"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { completeCheckoutCartCleanup } from "@/services/cartCheckoutRecovery";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    completeCheckoutCartCleanup(dispatch);
  }, [dispatch]);

  return (
    <section className="py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
      <p className="mb-6">Your order has been placed successfully.</p>
      <p className="text-lg font-semibold">Thank you for your purchase!</p>

      <button
        onClick={() => router.push("/")}
        className="bg-black text-white px-6 py-2 rounded-md"
      >
        Continue Shopping
      </button>
    </section>
  );
}
