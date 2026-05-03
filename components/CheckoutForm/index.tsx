import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  //   const handlePayment = async () => {
  //     if (!stripe || !elements) return;

  //     setLoading(true);

  //     const cardElement = elements.getElement(CardElement);
  //     if (!cardElement) return;

  //     const result = await stripe.confirmCardPayment(clientSecret, {
  //       payment_method: {
  //         card: cardElement,
  //       },
  //     });

  //     if (result.error) {
  //       console.error(result.error.message);
  //       setLoading(false);
  //     } else if (result.paymentIntent?.status === "succeeded") {
  //       router.push("/payment/success");
  //     }
  //   };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    console.log("CARD ELEMENT:", cardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    console.log("PAYMENT RESULT:", result);

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="border p-4 rounded-md">
        <CardElement />
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded-md"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
