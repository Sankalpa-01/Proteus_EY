import Layout from "@/components/layout/Layout";
import CategoryCard from "@/components/products/CategoryCard";
import BrandLogo from "@/components/products/BrandLogo";
import { Button } from "@/components/ui/button";

// Import generated images
import categoryWomen from "@/assets/chick.png";
import categoryMen from "@/assets/guy.png";
import categoryKids from "@/assets/kiddos.png";
import categoryAccessories from "@/assets/jewel.png";
import categoryDecor from "@/assets/home.png";

const categories = [
  { 
    title: "Shop Women", 
    image: categoryWomen,
    href: "/shop/women"
  },
  { 
    title: "Shop Men", 
    image: categoryMen,
    href: "/shop/men"
  },
  { 
    title: "Shop Kids", 
    image: categoryKids,
    href: "/shop/kids"
  },
  { 
    title: "Shop Accessories", 
    image: categoryAccessories,
    href: "/shop/accessories"
  },
  { 
    title: "Shop Decor", 
    image: categoryDecor,
    href: "/shop/decor"
  },
];

const brands = [
  "Allen Solly",
  "American Eagle",
  "Fred Perry",
  "Tommy Hilfiger",
  "Zara",
  "H&M",
];

const Products = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 1 column by default, 2 columns on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-3 sm:space-y-4">
            <CategoryCard
              {...categories[0]}
              className="h-28 sm:h-36 md:h-50 opacity-0 animate-slide-up"
              style={{ animationDelay: "0s", animationFillMode: "forwards" }}
            />
            <CategoryCard
              {...categories[1]}
              className="h-28 sm:h-36 md:h-50 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
            />
            <CategoryCard
              {...categories[3]}
              className="h-28 sm:h-36 md:h-50 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            />
          </div>

          {/* Right Column */}
          {/* apply the vertical offset ONLY on large screens */}
          <div className="space-y-3 sm:space-y-4 lg:mt-28">
            <CategoryCard
              {...categories[2]}
              className="h-28 sm:h-36 md:h-50 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            />
            <CategoryCard
              {...categories[4]}
              className="h-28 sm:h-36 md:h-50 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
            />
          </div>
        </div>

        {/* Brands Section with Endless Scroll */}
        <section className="mt-10 sm:mt-16 text-center">
          <Button
            variant="category"
            size="default"
            className="mb-6 sm:mb-8 text-sm sm:text-base"
          >
            Our brands
          </Button>
          <div className="relative overflow-hidden">
            <div className="flex gap-4 sm:gap-8 animate-scroll">
              {[...brands, ...brands, ...brands].map((brand, i) => (
                <BrandLogo key={`${brand}-${i}`} name={brand} className="flex-shrink-0" />
              ))}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </Layout>
  );
};

export default Products;
