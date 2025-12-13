import Layout from "@/components/layout/Layout";
import CategoryCard from "@/components/products/CategoryCard";
import BrandLogo from "@/components/products/BrandLogo";
import { Button } from "@/components/ui/button";

// Import generated images
import categoryWomen from "@/assets/category-women.jpg";
import categoryMen from "@/assets/category-men.jpg";
import categoryKids from "@/assets/category-kids.jpg";
import categoryAccessories from "@/assets/category-accessories.jpg";
import categoryDecor from "@/assets/category-decor.jpg";

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
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Category Cards */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {/* First row - 2 cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {categories.slice(0, 2).map((cat, i) => (
                <CategoryCard
                  key={cat.title}
                  {...cat}
                  className="h-40 sm:h-48 md:h-56 opacity-0 animate-slide-up"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}
                />
              ))}
            </div>
            {/* Second row - 3 cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {categories.slice(2).map((cat, i) => (
                <CategoryCard
                  key={cat.title}
                  {...cat}
                  className="h-32 sm:h-36 md:h-44 opacity-0 animate-slide-up"
                  style={{ animationDelay: `${(i + 2) * 0.1}s`, animationFillMode: "forwards" }}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Featured Images */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
            <div className="overflow-hidden rounded-xl sm:rounded-2xl hover-lift opacity-0 animate-slide-in-right" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <img
                src={categoryMen}
                alt="Featured man"
                className="w-full h-40 sm:h-48 lg:h-64 object-cover image-hover"
              />
            </div>
            <div className="overflow-hidden rounded-xl sm:rounded-2xl hover-lift opacity-0 animate-slide-in-right" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              <img
                src={categoryWomen}
                alt="Featured woman"
                className="w-full h-40 sm:h-48 lg:h-64 object-cover image-hover"
              />
            </div>
          </div>
        </div>

        {/* Brands Section */}
        <section className="mt-10 sm:mt-16 text-center">
          <Button variant="category" size="default" className="mb-6 sm:mb-8 text-sm sm:text-base">
            Our brands
          </Button>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {brands.map((brand, i) => (
              <BrandLogo
                key={brand}
                name={brand}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Products;
