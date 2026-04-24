"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const cart = useSelector((state: any) => state.cart);

  console.log("cart redux data (checkout page) ==>> ", cart);

  const totalItems = cart?.summary?.totalQuantity || 0;

  useEffect(() => {
    if (!user?.id) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user?.id) return null;

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

  if (!user?.id) return null;

  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container px-4 md:px-6 space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Confirm your order
        </h1>
        <p className="text-muted-foreground">
          You are about to place an order for{" "}
          <span className="font-semibold">{totalItems}</span>{" "}
          {totalItems === 1 ? "item" : "items"}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            onClick={() => {
              // Placeholder for actual order placement logic
              router.push("/cart");
            }}
          >
            Confirm &amp; Checkout
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </section>
  );
}
