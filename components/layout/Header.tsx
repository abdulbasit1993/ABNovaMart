"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

// Mock Auth and Cart State for UI demonstration
const useAuth = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const logout = () => setUser(null);
  return { user, login: () => setUser({ name: "John Doe" }), logout };
};

const useCart = () => {
  return { count: 3 }; // Mock 3 items in cart
};

export function Header() {
  const { user } = useAuth();
  const { count } = useCart();

  //   Sample categories for dropdown
  const categories = [
    {
      name: "Electronics",
      subCat: [
        { name: "Mobile Phones", sub: ["Smartphones", "Feature Phones"] },
        { name: "Laptops", sub: ["Macbook", "Windows", "Chromebook"] },
        "Accessories",
      ],
    },
    { name: "Fashion", subCat: ["Men", "Women", "Kids"] },
    { name: "Home & Living" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 text-xl font-bold">
          <span className="text-primary">ABNova</span>
          <span>Mart</span>
        </Link>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hidden md:flex">
              <Menu className="mr-2 h-4 w-4" />
              Categories
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-64 max-h-96 overflow-y-auto"
          >
            {categories.map((cat) => (
              <DropdownMenuGroup key={cat.name}>
                {Array.isArray(cat.subCat) ? (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>{cat.name}</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {cat.subCat.map((sub) =>
                          typeof sub === "string" ? (
                            <DropdownMenuItem key={sub}>
                              <Link href={`/category/${sub.toLowerCase()}`}>
                                {sub}
                              </Link>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuSub key={sub.name}>
                              <DropdownMenuSubTrigger>
                                {sub.name}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  {sub.sub.map((deep) => (
                                    <DropdownMenuItem key={deep}>
                                      <Link
                                        href={`/category/${deep.toLowerCase()}`}
                                      >
                                        {deep}
                                      </Link>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          )
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ) : (
                  <DropdownMenuItem>
                    <Link href={`/category/${cat.name.toLowerCase()}`}>
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Bar */}
        <div className="flex flex-1 items-center gap-2 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search store..." className="pl-10 w-full" />
          </div>
        </div>

        {/* Account Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex flex-col h-auto py-2 px-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">Account</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {user ? `Hello, ${user.name}` : "Hello, Sign In"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="end">
            {user ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-xs uppercase text-muted-foreground">
                    Welcome
                  </p>
                  <p className="font-semibold">{user.name}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <Link
                    href="#"
                    className="block px-2 py-1.5 text-sm hover:bg-accent rounded"
                  >
                    My Account
                  </Link>
                  <Link
                    href="#"
                    className="block px-2 py-1.5 text-sm hover:bg-accent rounded"
                  >
                    My Orders
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      // Handle sign out
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <div className="text-center text-sm">
                  New customer?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Register
                  </Link>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Cart */}
        <Button variant="ghost" size="sm" className="relative" asChild>
          <Link href="/cart">
            <ShoppingCart className="h-6 w-6" />
            <span className="ml-1 hidden sm:inline">Cart</span>
            {count > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                {count}
              </Badge>
            )}
          </Link>
        </Button>
      </div>
    </header>
  );
}
