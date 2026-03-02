"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { BASE_URL } from "@/constants/apiUrl";
import TrustBar from "@/components/TrustBar";
import { Product, ProductCard } from "@/components/products/ProductCard";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${BASE_URL}/products`);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        const products: Product[] = data?.data ?? [];

        setFeaturedProducts(products.slice(0, 4));
      } catch (err) {
        console.error("Error fetching featured products", err);
        setError("Unable to load featured products right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10 py-24 md:py-32 lg:py-40 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur">
            New Collection 2025
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Discover Your
            <br />
            <span className="text-indigo-200">Perfect Style</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
            Explore our curated collection of premium products. From electronics
            to fashion, find everything you need with unbeatable prices.
          </p>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="bg-background py-12 md:py-16">
        <div className="container px-4 md:px-6 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Featured Products
              </h2>
              <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl">
                Handpicked items just for you. Discover our most popular and
                best value products right now.
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="self-start md:self-auto"
            >
              <Link href="/products" className="flex items-center gap-2">
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="animate-pulse bg-muted/40 border-dashed"
                >
                  <div className="aspect-[4/3] w-full rounded-lg bg-muted" />
                  <CardContent className="space-y-3 pt-4">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                    <div className="h-3 w-full rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="py-6 text-sm text-destructive">
                {error}
              </CardContent>
            </Card>
          ) : featuredProducts.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-sm text-muted-foreground">
                No featured products available right now. Please check back
                later.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TRUST BAR SECTION */}
      <section>
        <TrustBar />
      </section>
    </>
  );
}
