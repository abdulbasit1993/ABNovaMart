"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product } from "./ProductCard";
import { addToCart } from "@/services/cartService";
import { addItem } from "@/redux/slices/cartSlice";

type ProductActionsProps = {
  product: Product;
};

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleAddToCart = async () => {
    if (!user?.id) {
      router.push("/login");
      return;
    }

    if (quantity < 1) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setIsAdding(true);
    try {
      const result = await addToCart({
        productId: product._id,
        quantity: quantity,
      });

      if (result) {
        dispatch(
          addItem({
            productId: product._id,
            quantity: quantity,
            price: product.price,
            name: product.name,
            image: product.images?.[0],
          }),
        );
        toast.success(`Added ${quantity} item(s) to cart`);
        setQuantity(1); // Reset quantity after adding
      }
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (user?.id) {
      router.push(`/checkout?productId=${product._id}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex items-center gap-2">
        <label htmlFor="quantity" className="text-sm font-medium">
          Qty:
        </label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-20"
        />
      </div>
      <Button
        size="lg"
        className="flex-1"
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="flex-1"
        onClick={handleBuyNow}
      >
        Buy Now
      </Button>
    </div>
  );
}
