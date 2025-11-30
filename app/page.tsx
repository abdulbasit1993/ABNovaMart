"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";

export default function Home() {
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
    </>
  );
}
