import Image from "next/image";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/constants/apiUrl";
import { Product, getProductPrice } from "@/components/products/ProductCard";
import { ProductActions } from "@/components/products/ProductActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProductDetailResponse = {
  data?: Product;
};

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      // Ensure fresh data per request while allowing some caching by Next
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const json: ProductDetailResponse = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.error("Error fetching product detail", error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const product = await fetchProduct(params.id);

  if (!product) {
    notFound();
  }

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
    <section className="bg-background py-10 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Badge className="bg-primary/90 text-white">Featured</Badge>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {product.name}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {displayPrice}
              </p>
              <p className="text-xs text-muted-foreground">
                All prices are inclusive of applicable taxes.
              </p>
            </div>

            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}

