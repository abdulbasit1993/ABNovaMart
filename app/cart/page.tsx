"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingBag, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  setCartFromApi,
  updateItemQuantity,
  clearCart,
} from "@/redux/slices/cartSlice";
import { fetchCart, clearCart as clearCartApi } from "@/services/cartService";
import type { RootState } from "@/redux/store";
import type { CartItem } from "@/redux/slices/cartSlice";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const cart = useSelector((state: RootState) => state.cart);
  const { cartItems, summary, loading } = cart;
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    // Sync cart from API when cart not yet loaded (e.g. direct navigate to /cart)
    fetchCart().then((data) => {
      if (data) dispatch(setCartFromApi(data));
    });
  }, [user?.id, dispatch]);

  const subtotal =
    summary?.subtotal ??
    cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalQuantity =
    summary?.totalQuantity ?? cartItems.reduce((s, i) => s + i.quantity, 0);
  const isEmpty = cartItems.length === 0;

  const handleClearCart = async () => {
    if (isClearing) return;
    setIsClearing(true);
    try {
      const success = await clearCartApi();
      if (success) {
        dispatch(clearCart());
        toast.success("Cart cleared successfully");
      } else {
        toast.error("Failed to clear cart");
      }
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setIsClearing(false);
    }
  };

  if (!user?.id) {
    return (
      <section className="bg-background py-10 md:py-16">
        <div className="container px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Your Cart</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to view and manage your cart.
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container px-4 md:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Your Cart
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isEmpty
                ? "Your cart is empty."
                : `${totalQuantity} item${totalQuantity !== 1 ? "s" : ""} in your cart.`}
            </p>
          </div>
          {!isEmpty && (
            <Button
              variant="destructive"
              onClick={handleClearCart}
              disabled={isClearing}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isClearing ? "Clearing..." : "Clear Cart"}
            </Button>
          )}
        </div>

        {loading && cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="mt-4">Loading cart...</p>
          </div>
        ) : isEmpty ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="mt-6 text-lg font-semibold">
                No items in your cart
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Add products from the store to see them here.
              </p>
              <Button className="mt-8" asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      Rs {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Taxes and shipping calculated at checkout.
                  </p>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="text-primary">
                      Rs {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => router.push("/checkout")}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CartItemRow({ item }: { item: CartItem }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);

  const imageUrl = item.image ?? "/placeholder-product.png";
  const lineTotal = item.price * item.quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(
      updateItemQuantity({ productId: item.productId, quantity: newQuantity }),
    );
    setQuantity(newQuantity);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
            <Image
              src={imageUrl}
              alt={item.name ?? "Product"}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${item.productId}`}
              className="font-medium hover:text-primary hover:underline"
            >
              {item.name ?? `Product ${item.productId}`}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              Rs {item.price.toLocaleString()} each
            </p>
            <div className="mt-2 flex items-center gap-2">
              <label
                htmlFor={`qty-${item.productId}`}
                className="text-sm text-muted-foreground"
              >
                Qty:
              </label>
              <Input
                id={`qty-${item.productId}`}
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                onBlur={() =>
                  quantity !== item.quantity && handleQuantityChange(quantity)
                }
                className="w-20 h-8"
              />
            </div>
            <p className="mt-3 font-semibold text-primary">
              Rs {lineTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
