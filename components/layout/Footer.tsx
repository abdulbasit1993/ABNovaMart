"use client";
import React from "react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import {
  Facebook,
  X,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Column 1: Logo + About */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-2xl font-bold"
            >
              <span className="text-primary">ABNova</span>
              <span>Mart</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your trusted online store for quality products at the best prices.
              Shop with confidence, delivered with care.
            </p>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/category/electronics"
                  className="hover:text-primary transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/category/fashion"
                  className="hover:text-primary transition-colors"
                >
                  Fashion
                </Link>
              </li>
              <li>
                <Link
                  href="/category/home-living"
                  className="hover:text-primary transition-colors"
                >
                  Home & Living
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>
                  123 Commerce Street
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href="mailto:support@abnovamart.com"
                  className="hover:text-primary"
                >
                  support@abnovamart.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + Copyright */}
        <Separator className="my-10" />
        <div className="text-center text-sm text-muted-foreground">
          © {currentYear} ABNovaMart. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
