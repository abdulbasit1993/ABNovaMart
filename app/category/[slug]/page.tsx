import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product, ProductCard } from "@/components/products/ProductCard";
import { BASE_URL } from "@/constants/apiUrl";

// ------------------ Dummy data -----------------
type DummyCategory = {
    name: string;
    slug: string;
    description: string;
}

const DUMMY_CATEGORIES: DummyCategory[] = [
    {
        name: "Groceries",
        slug: "groceries",
        description: "Everyday essentials — fresh staples, dairy and pantry items.",
    },
    {
        name: "Dairy",
        slug: "dairy",
        description: "Milk, yogurt, cheese and more - farm fresh every day.",
    },
    {
        name: "Cheese & Cream",
        slug: "cheese-and-cream",
        description: "Blocks, slices and creams for every recipe.",
    }
];

const DUMMY_PRODUCTS: Product[] = [
    {
        _id: "dummy-1",
        name: "Nurpur Full Cream Milk Tetra Pack, 250ml",
        price: { $numberDecimal: "0.35"},
        description: "Fresh full cream milk, perfect for tea and everyday use.",
        images: ["https://res.cloudinary.com/dmtxtryut/image/upload/v1782118849/abnovamart/products/1200334-1-1782118848481.jpg"]
    },
    {
        _id: "dummy-2",
        name: "Cheddar Block Cheese, 500g",
        price: { $numberDecimal: "4.75"},
        description: "Rich, aged cheddar block — great for sandwiches and cooking.",
        images: ["https://res.cloudinary.com/dmtxtryut/image/upload/v1782118849/abnovamart/products/1200334-1-1782118848481.jpg"]
    },
];

// ------------------ Page ------------------

type CategoryPageProps = {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }>}) {
    const { slug } = await params;

    const categoriesRes = await fetch(`${BASE_URL}/product-categories`, { cache: 'no-store'})
    .then((r) => r.json())
    .catch(() => null);

    const category = categoriesRes?.categories?.find(
        (cat: { _id: string; name: string; slug: string}) => cat.slug === slug
    );

    if (!category) {
        notFound();
    }

    const productsRes = await fetch(`${BASE_URL}/products?categoryId=${category._id}`, {
        cache: "no-store"
    })
    .then((r) => r.json())
    .catch(() => null);

    const products = productsRes?.data ?? [];

    return (
        <div className="bg-background">
            {/* ------------------ Banner ------------------ */}
            <section className="relative overflow-hidden border-b">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                <div className="container relative px-4 py-10 md:px-6 md:py-14">
                    {/* ------------------ Breadcrumb ------------------ */}
                    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Link href="/" 
                        className="flex items-center gap-1 hover:text-primary">
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground">
                            {category.name}
                        </span>
                    </nav>

                    <Badge variant="secondary" className="mb-3">
                        Category
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                        {category.name}
                    </h1>
                    <p className="mt-2 max-w-xl text-sm md:text-base text-muted-foreground">
                        {category.description}
                    </p>

                    {/* ------------------ Subcategory quick links (dummy) ------------------ */}
                    <div className="mt-5 flex flex-wrap gap-2">
                        {DUMMY_CATEGORIES.filter((cat) => cat.slug !== category.slug).map(
                            (cat) => (
                                <Link key={cat.slug} href={`/category/${cat.slug}`}
                                className="rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
                                >
                                    {cat.name}
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* ------------------ Toolbar ------------------ */}
            <div className="container px-4 md:px-6">
                <div className="flex items-center justify-betwwen border-b py-4">
                    <p className="text-sm text-muted-foreground">
                        Showing{" "}
                    <span className="font-medium text-foreground">
                        {products.length}
                    </span>{" "}
                    {products.length === 1 ? "product" : "products"}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Sort: Featured</span>
                    </div>
                </div>
            </div>

            {/* ------------------ Products grid ------------------ */}
            <section className="container px-4 py-8 md:px-6 md:py-12">
                {products.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center text-sm text-muted-foreground">
                            No products found in this category right now. Please check back later.
                        </CardContent>
                    </Card>) : (<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    )}

                    <Separator className="my-8" />
            </section>

            {/* ------------------ Dummy newsletter strip (visual only) ------------------ */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-lg border bg-muted/30 p-5 md:flex-row md:items-center">
            <div>
                <p className="font-medium">Deals in {category.name}</p>
                <p className="text-sm text-muted-foreground">
                    Subscribe to get notified about weekly offers.
                </p>
            </div>
            <Link href="/register"
            className="text-sm font-medium text-primary hover:underline"
            >
            Sign up now →</Link>
            </div>
        </div>
    );
}