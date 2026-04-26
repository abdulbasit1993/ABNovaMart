import apiService from "./apiService";
import type { CartApiPayload } from "@/redux/slices/cartSlice";
import { BASE_URL } from "@/constants/apiUrl";

export type CartApiResponse = {
  success: boolean;
  message: string;
  data: CartApiPayload;
};

export type AddToCartPayload = {
  productId: string;
  quantity: number;
};

export type AddToCartResponse = {
  success: boolean;
  message: string;
  data: CartApiPayload;
};

/**
 * Fetches the current user's cart from GET /cart.
 * Requires auth token (apiService adds it from localStorage).
 */
export async function fetchCart(): Promise<CartApiPayload | null> {
  try {
    const res = await apiService.get<CartApiResponse>("/cart");
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

/**
 * Adds an item to the cart via POST /cart/items.
 * Requires auth token (apiService adds it from localStorage).
 */
export async function addToCart(
  payload: AddToCartPayload,
): Promise<CartApiPayload | null> {
  try {
    const res = await apiService.post<AddToCartResponse>(
      "/cart/items",
      payload,
    );
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
  }
}

/**
 * Removes an item from the cart via DELETE /cart/items/:productId.
 */
export async function removeCartItem(
  productId: string,
): Promise<CartApiPayload | null> {
  try {
    const res = await apiService.delete<CartApiResponse>(
      `/cart/items/${productId}`,
    );
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error removing cart item:", error);
    return null;
  }
}

export const updateCartItem = async (productId: string, quantity: number) => {
  try {
    const res = await apiService.patch(`/cart/items/${productId}`, {
      quantity: quantity,
    });
    return res.data;
  } catch (err) {
    console.error("Error updating cart item: ", err);
    return null;
  }
};

/**
 * Clears the entire cart via DELETE /cart.
 */
export async function clearCart(): Promise<boolean> {
  try {
    const res = await apiService.delete<{ success: boolean; message: string }>(
      "/cart",
    );
    return res.data?.success ?? false;
  } catch (error) {
    console.error("Error clearing cart:", error);
    return false;
  }
}
