import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  completeCheckoutCartCleanup,
  restoreCartAfterCheckoutFailure,
} from "@/services/cartCheckoutRecovery";

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const dispatch = useDispatch();

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
    if (!cardElement) {
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      console.error(result.error.message);
      await restoreCartAfterCheckoutFailure(dispatch);
      toast.error(result.error.message ?? "Payment failed. Your cart has been restored.");
      setLoading(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      completeCheckoutCartCleanup(dispatch);
      router.push("/payment/success");
      return;
    }

    await restoreCartAfterCheckoutFailure(dispatch);
    toast.error("Payment could not be completed. Your cart has been restored.");
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
