import {
  clearCart,
  setCartFromApi,
  type CartItem,
} from "@/redux/slices/cartSlice";
import type { AppDispatch } from "@/redux/store";
import { addToCart, fetchCart } from "@/services/cartService";

const SNAPSHOT_KEY = "checkout_cart_snapshot";

export function saveCheckoutCartSnapshot(items: CartItem[]): void {
  if (typeof window === "undefined" || items.length === 0) return;
  sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(items));
}

export function clearCheckoutCartSnapshot(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SNAPSHOT_KEY);
}

function getCheckoutCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = sessionStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Re-syncs Redux with the backend cart after a failed checkout/payment.
 * If the backend cart was cleared, re-adds items from the pre-checkout snapshot.
 */
export async function restoreCartAfterCheckoutFailure(
  dispatch: AppDispatch,
): Promise<void> {
  const snapshot = getCheckoutCartSnapshot();
  if (snapshot.length === 0) return;

  const current = await fetchCart();
  if (current?.items?.length) {
    dispatch(setCartFromApi(current));
    clearCheckoutCartSnapshot();
    return;
  }

  for (const item of snapshot) {
    if (!item.productId || item.quantity < 1) continue;
    await addToCart({ productId: item.productId, quantity: item.quantity });
  }

  const restored = await fetchCart();
  if (restored) {
    dispatch(setCartFromApi(restored));
  }
}

export function completeCheckoutCartCleanup(dispatch: AppDispatch): void {
  clearCheckoutCartSnapshot();
  dispatch(clearCart());
}
