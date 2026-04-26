"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import OrderSummary from "./OrderSummary";
import AddressSection from "./AddressSection";
import DeliveryMethod from "./DeliveryMethod";
import PaymentSection from "./PaymentSection";

export default function CheckoutPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const cart = useSelector((state: any) => state.cart);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  console.log("cart redux data (checkout page) ==>> ", cart);

  const totalItems = cart?.summary?.totalQuantity || 0;

  useEffect(() => {
    if (!user?.id) {
      router.replace("/login");
    }
  }, [user, router]);

  const handleConfirmCheckout = () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    // Simulate delay for UX
    setTimeout(() => {
      router.push("/cart");
    }, 2000);
  };

  if (!cart?.cartItems?.length) {
    return (
      <section className="bg-background py-10 md:py-16">
        <div className="container px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Your cart is empty
          </h1>

          <div className="mt-6">
            <Button variant="outline" onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!user?.id) {
    return (
      <section className="bg-background py-10 md:py-16">
        <div className="container px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Redirecting to login...
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container px-4 md:px-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Secure Checkout
          </h1>
          <p className="text-muted-foreground mt-2">
            You are about to place an order for{" "}
            <span className="font-semibold">{totalItems}</span>{" "}
            {totalItems === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <AddressSection user={user} />
            <DeliveryMethod />
            <PaymentSection />
          </div>
          <div>
            <OrderSummary cartItems={cart.cartItems} summary={cart.summary} />
            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                size="lg"
                onClick={handleConfirmCheckout}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? "Placing Order..." : "Confirm & Checkout"}
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
