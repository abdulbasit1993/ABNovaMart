 "use client";

 import { useSearchParams, useRouter } from "next/navigation";
 import { useSelector } from "react-redux";
 import { Button } from "@/components/ui/button";

 export default function CheckoutPage() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const user = useSelector((state: any) => state.user);

   const productId = searchParams.get("productId");

   if (!user?.id) {
     router.replace("/login");
     return null;
   }

   if (!productId) {
     return (
       <section className="bg-background py-10 md:py-16">
         <div className="container px-4 md:px-6">
           <h1 className="text-2xl md:text-3xl font-semibold">
             No product selected
           </h1>
           <p className="mt-2 text-muted-foreground">
             Please go back and choose a product to continue to checkout.
           </p>
           <div className="mt-6">
             <Button variant="outline" onClick={() => router.push("/")}>
               Back to Home
             </Button>
           </div>
         </div>
       </section>
     );
   }

   return (
     <section className="bg-background py-10 md:py-16">
       <div className="container px-4 md:px-6 space-y-6">
         <h1 className="text-2xl md:text-3xl font-semibold">
           Confirm your order
         </h1>
         <p className="text-muted-foreground">
           You are about to place an order for product ID:{" "}
           <span className="font-semibold">{productId}</span>.
         </p>
         <div className="flex flex-wrap gap-3">
           <Button
             size="lg"
             onClick={() => {
               // Placeholder for actual order placement logic
               router.push("/cart");
             }}
           >
             Confirm &amp; Checkout
           </Button>
           <Button
             size="lg"
             variant="outline"
             onClick={() => router.back()}
           >
             Cancel
           </Button>
         </div>
       </div>
     </section>
   );
 }

