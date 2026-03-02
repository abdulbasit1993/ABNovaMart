import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

export type ProductPrice =
  | number
  | {
      $numberDecimal?: string;
    };

export type Product = {
  _id: string;
  name: string;
  price: ProductPrice;
  description: string;
  images: string[];
};

export const getProductPrice = (price: ProductPrice) => {
  if (typeof price === "number") return price;
  if (typeof price?.$numberDecimal === "string") {
    const parsed = Number(price.$numberDecimal);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const priceValue = getProductPrice(product.price);
  const displayPrice =
    priceValue > 0
      ? `Rs ${priceValue.toLocaleString()}`
      : "Price not available";

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder-product.png";

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge className="bg-primary/90 text-white shadow">Featured</Badge>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white backdrop-blur">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>4.8</span>
        </div>
      </div>

      <CardContent className="space-y-2 pt-4">
        <h3 className="line-clamp-2 text-sm font-semibold md:text-base">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 md:text-sm">
          {product.description}
        </p>
        <p className="pt-1 text-base font-semibold text-primary md:text-lg">
          {displayPrice}
        </p>
      </CardContent>

      <CardFooter className="mt-auto flex items-center justify-between gap-2 pt-0">
        <Button size="sm" className="flex-1 gap-2" asChild>
          <Link href={`/products/${product._id}`}>
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Link>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="hidden sm:inline-flex"
          asChild
        >
          <Link href={`/products/${product._id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

