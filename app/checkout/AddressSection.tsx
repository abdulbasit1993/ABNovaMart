"use client";

import React from "react";
import { UserState } from "@/redux/slices/userSlice";

interface AddressSectionProps {
  user: UserState;
}

export default function AddressSection({ user }: AddressSectionProps) {
  // Since user state doesn't include address, show "No address found"
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
      <div className="text-muted-foreground">
        No address found. Please update your profile with a shipping address.
      </div>
    </div>
  );
}