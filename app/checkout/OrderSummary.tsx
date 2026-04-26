"use client";

import React from "react";
import { CartItem, CartSummary } from "@/redux/slices/cartSlice";

interface OrderSummaryProps {
  cartItems: CartItem[];
  summary: CartSummary | null;
}

export default function OrderSummary({
  cartItems,
  summary,
}: OrderSummaryProps) {
  console.log("cartItems: ", cartItems);
  console.log("summary: ", summary);

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItemRow key={item.productId} item={item} />
        ))}
      </div>
      <div className="border-t pt-4 mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Total Quantity:</span>
          <span className="font-semibold">{summary?.totalQuantity || 0}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal:</span>
          <span>${(summary?.subtotal || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

interface CartItemRowProps {
  item: CartItem;
}

function CartItemRow({ item }: CartItemRowProps) {
  console.log("CartItemRow item: ", item);
  const price =
    typeof item.price === "object" && (item.price as any)?.$numberDecimal
      ? parseFloat((item.price as any).$numberDecimal)
      : item.price || 0;

  return (
    <div className="flex items-center space-x-4">
      {item.image && (
        <img
          src={item.image}
          alt={item.name || "Product"}
          className="w-16 h-16 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <h3 className="font-medium">{item.name || "Unnamed Product"}</h3>
        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">
          ${(price * (item.quantity || 0)).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
