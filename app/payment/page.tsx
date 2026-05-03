"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function PaymentPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const cs = params.get("clientSecret");

    if (!cs) {
      router.replace("/");
    } else {
      setClientSecret(cs);
    }
  }, [params, router]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p>Loading payment...</p>
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="container max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Complete Payment
        </h1>

        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: { theme: "stripe" } }}
        >
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      </div>
    </section>
  );
}
