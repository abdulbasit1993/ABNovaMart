"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import apiService from "@/services/apiService";
import OrderSummary from "./OrderSummary";
import AddressSection, { AddressPayload } from "./AddressSection";

export default function CheckoutPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const cart = useSelector((state: any) => state.cart);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [addressPayload, setAddressPayload] = useState<AddressPayload | null>(
    null,
  );
  const [savedAddressId, setSavedAddressId] = useState<string | null>(null);

  // Refs to always read the latest values (avoids stale closures)
  const addressPayloadRef = useRef<AddressPayload | null>(null);
  const savedAddressIdRef = useRef<string | null>(null);

  // Used to fire validation inside AddressSection on demand
  const [triggerValidation, setTriggerValidation] = useState(false);

  // Callback ref to resolve the pending checkout after validation result arrives
  const pendingCheckout = useRef(false);

  const totalItems = cart?.summary?.totalQuantity || 0;

  useEffect(() => {
    if (!user?.id) {
      router.replace("/login");
    }
  }, [user, router]);

  const handlePayloadReady = useCallback((payload: AddressPayload | null) => {
    setAddressPayload(payload);
    addressPayloadRef.current = payload;
  }, []);

  const handleSavedAddressId = useCallback((id: string) => {
    setSavedAddressId(id);
    savedAddressIdRef.current = id;
  }, []);

  const performCheckout = useCallback(
    async (
      shippingId: string,
      billingId: string | null,
      sameAsShipping: boolean,
    ) => {
      try {
        const checkoutBody: Record<string, any> = {
          shippingAddressId: shippingId,
          sameAsShipping,
        };

        if (!sameAsShipping && billingId) {
          checkoutBody.billingAddressId = billingId;
        }

        const res = await apiService.post("/orders/checkout", checkoutBody);
        const response = res?.data;

        const { clientSecret, order } = response?.data;

        if (response?.success) {
          router.push(
            `/payment?clientSecret=${clientSecret}&orderId=${order?._id}`,
          );
        }
      } catch (err) {
        console.error("Checkout failed:", err);
      } finally {
        setIsPlacingOrder(false);
      }
    },
    [router],
  );

  const handleValidationResult = useCallback(
    async (isValid: boolean) => {
      // Reset the trigger so it can fire again next time
      setTriggerValidation(false);

      if (!pendingCheckout.current) return;
      pendingCheckout.current = false;

      if (!isValid) {
        setIsPlacingOrder(false);
        return;
      }

      // Read latest values from refs to avoid stale closures
      const currentPayload = addressPayloadRef.current;
      const currentSavedId = savedAddressIdRef.current;

      console.log("handleValidationResult ==>> ", {
        currentPayload,
        currentSavedId,
      });

      try {
        // Case 1: User already has a saved address
        if (currentSavedId && !currentPayload) {
          await performCheckout(currentSavedId, null, true);
          return;
        }

        // Case 2: User entered a new address — create it first
        if (currentPayload) {
          const addRes = await apiService.post(
            "/addresses/add",
            currentPayload,
          );
          const addResponse = addRes?.data;

          if (addResponse?.success) {
            const responseData = addResponse.data;

            let shippingId: string | null = null;
            let billingId: string | null = null;

            // Response is an array of addresses with addressType
            if (Array.isArray(responseData)) {
              const shippingAddr = responseData.find(
                (addr: any) => addr.addressType === "shipping",
              );
              const billingAddr = responseData.find(
                (addr: any) => addr.addressType === "billing",
              );
              shippingId = shippingAddr?._id || null;
              billingId = billingAddr?._id || null;
            } else {
              // Response is an object
              shippingId =
                responseData?.shippingAddress?._id ||
                responseData?.shippingAddressId ||
                null;
              billingId =
                responseData?.billingAddress?._id ||
                responseData?.billingAddressId ||
                null;
            }

            console.log("Extracted address IDs ==>> ", {
              shippingId,
              billingId,
            });

            if (shippingId) {
              await performCheckout(
                shippingId,
                billingId,
                currentPayload.sameAsShipping,
              );
            }
          }
        }
      } catch (err) {
        console.error("Checkout flow failed:", err);
        setIsPlacingOrder(false);
      }
    },
    [performCheckout],
  );

  const handleConfirmCheckout = () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    pendingCheckout.current = true;
    // Trigger validation inside AddressSection
    setTriggerValidation(true);
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
          <div>
            <AddressSection
              onPayloadReady={handlePayloadReady}
              onSavedAddressId={handleSavedAddressId}
              triggerValidation={triggerValidation}
              onValidationResult={handleValidationResult}
            />
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
