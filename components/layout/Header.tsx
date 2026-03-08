"use client";
import React from "react";
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
import { useSelector } from "react-redux";


type Category = {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
};

type CategoryNode = Category & {
  children: CategoryNode[];
};

type HeaderProps = {
  categoryData?: Category[];
};

const buildCategoryTree = (categories: Category[] = []): CategoryNode[] => {
  const nodeMap = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  categories.forEach((cat) => {
    nodeMap.set(cat._id, { ...cat, children: [] });
  });

  nodeMap.forEach((node) => {
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
};

const renderCategoryNode = (node: CategoryNode) => {
  if (node.children.length > 0) {
    return (
      <DropdownMenuSub key={node._id}>
        <DropdownMenuSubTrigger>{node.name}</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {node.children.map((child) => renderCategoryNode(child))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenuItem key={node._id}>
      <Link href={`/category/${node.slug}`}>{node.name}</Link>
    </DropdownMenuItem>
  );
};

export function Header({ categoryData }: HeaderProps) {
  const user = useSelector((state: any) => state.user);
  const cart = useSelector((state: any) => state.cart);
  const count =
    cart?.summary?.totalQuantity ??
    cart?.cartItems?.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0) ??
    0;

  const categoryTree = buildCategoryTree(categoryData ?? []);

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
            {categoryTree.length ? (
              categoryTree.map((root) => (
                <DropdownMenuGroup key={root._id}>
                  {renderCategoryNode(root)}
                </DropdownMenuGroup>
              ))
            ) : (
              <DropdownMenuItem disabled>No categories available</DropdownMenuItem>
            )}
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
                {user?.id ? `Hello, ${user.firstName}` : "Hello, Sign In"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="end">
            {user?.id ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-xs uppercase text-muted-foreground">
                    Welcome
                  </p>
                  <p className="font-semibold">
                    {user.firstName + " " + user.lastName}
                  </p>
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
                  <Link
                    href="/register"
                    className="text-primary hover:underline"
                  >
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
