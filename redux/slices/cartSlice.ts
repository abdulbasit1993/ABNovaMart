import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

/** Shape of one item from GET /cart API (items array) */
export interface CartApiItem {
  productId?: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
  product?: { name?: string; images?: string[] };
}

export interface CartSummary {
  itemsCount: number;
  totalQuantity: number;
  subtotal: number;
}

/** Payload from GET /cart API response data */
export interface CartApiPayload {
  cart: { _id: string; userId: string; status: string };
  items: CartApiItem[];
  summary: CartSummary;
}

interface CartState {
  cartId: string | null;
  userId: string | null;
  cartItems: CartItem[];
  summary: CartSummary | null;
  status: string;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartId: null,
  userId: null,
  cartItems: [],
  summary: null,
  status: "ACTIVE",
  loading: false,
  error: null,
};

function mapApiItemToCartItem(item: CartApiItem): CartItem {
  const rawId = item.productId ?? (item as any).productId ?? (item as any)._id;
  const productId =
    typeof rawId === "object" && rawId !== null && "_id" in rawId
      ? (rawId as { _id: string })._id
      : rawId;
  const name = item.name ?? item.product?.name;
  const image = item.image ?? item.product?.images?.[0];
  return {
    productId: String(productId ?? ""),
    quantity: item.quantity,
    price: item.price,
    ...(name && { name }),
    ...(image && { image }),
  };
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Used when the user logs in to load their existing backend cart
    setCart: (state, action: PayloadAction<any>) => {
      state.cartId = action.payload._id;
      state.userId = action.payload.userId;
      state.cartItems = action.payload.cartItems ?? [];
      state.status = action.payload.status ?? "ACTIVE";
      state.loading = false;
      state.error = null;
    },
    /** Set cart from GET /cart API response (login, register, or page load) */
    setCartFromApi: (state, action: PayloadAction<CartApiPayload>) => {
      const { cart, items, summary } = action.payload;
      state.cartId = cart._id;
      state.userId = cart.userId;
      state.cartItems = (items ?? []).map(mapApiItemToCartItem);
      state.summary = summary ?? null;
      state.status = cart.status ?? "ACTIVE";
      state.loading = false;
      state.error = null;
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
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
    // Update item quantity in the cart
    updateItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    // Remove an item from the cart
    removeItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== productId,
      );
    },
    clearCart: () => initialState,
  },
});

export const {
  setCart,
  setCartFromApi,
  setCartLoading,
  setCartError,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
