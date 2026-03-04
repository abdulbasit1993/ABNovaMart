import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

interface CartState {
  cartId: string | null;
  userId: string | null;
  cartItems: CartItem[];
  status: string;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartId: null,
  userId: null,
  cartItems: [],
  status: "ACTIVE",
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Used when the user logs in to load their existing backend cart
    setCart: (state, action: PayloadAction<any>) => {
      state.cartId = action.payload._id;
      state.userId = action.payload.userId;
      state.cartItems = action.payload.cartItems; // Populated from cart_items collection
      state.status = action.payload.status;
      state.loading = false;
      state.error = null;
    },
    // Optimistic update: Add to UI immediately while backend processes
    addItem: (state, action: PayloadAction<any>) => {
      const newItem = action.payload; // { productId, quantity, price }
      const existingItem = state.cartItems.find(
        (item) => item.productId === newItem.productId,
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.cartItems.push(newItem);
      }
    },
    clearCart: () => initialState,
  },
});

export const { setCart, addItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
