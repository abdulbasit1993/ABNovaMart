 "use client";

 import { useRouter } from "next/navigation";
 import { useSelector } from "react-redux";
 import { Button } from "@/components/ui/button";
 import type { Product } from "./ProductCard";

 type ProductActionsProps = {
   product: Product;
 };

 export function ProductActions({ product }: ProductActionsProps) {
   const router = useRouter();
   const user = useSelector((state: any) => state.user);

   const handleBuyNow = () => {
     if (user?.id) {
       router.push(`/checkout?productId=${product._id}`);
     } else {
       router.push("/login");
     }
   };

   return (
     <div className="flex flex-col gap-3 sm:flex-row">
       <Button size="lg" className="flex-1">
         Add to Cart
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

