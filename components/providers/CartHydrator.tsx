"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCartFromApi,
  setCartLoading,
  setCartError,
} from "@/redux/slices/cartSlice";
import { fetchCart } from "@/services/cartService";
import type { RootState } from "@/redux/store";

/**
 * When the user is logged in, fetches the cart from the API and syncs it to Redux.
 * Run once on mount and when user id becomes available (e.g. after rehydration).
 */
export function CartHydrator() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const cart = useSelector((state: RootState) => state.cart);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!user?.id) {
      hasFetchedRef.current = false;
      return;
    }
    // Avoid refetching on every render; fetch when we have user but no cart loaded yet
    if (hasFetchedRef.current) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;

    hasFetchedRef.current = true;
    dispatch(setCartLoading(true));

    fetchCart()
      .then((data) => {
        if (data) {
          dispatch(setCartFromApi(data));
        } else {
          dispatch(setCartError("Failed to load cart"));
        }
      })
      .catch(() => {
        dispatch(setCartError("Failed to load cart"));
      });
  }, [user?.id, dispatch]);

  return null;
}
