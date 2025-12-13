import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  heroImage: string;
  galleryImages: string[];
}

const HeroSection = ({ heroImage, galleryImages }: HeroSectionProps) => {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left - Hero Text */}
        <div className="space-y-6 sm:space-y-8 animate-fade-in order-2 lg:order-1">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight text-primary">
              Quality apparel at your fingertips
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-sans max-w-md">
              No need to spend an arm and leg on fashion
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
            <Button variant="hero" size="lg" className="sm:size-xl w-full sm:w-auto" asChild>
              <Link to="/shop/women">Shop Women</Link>
            </Button>
            <Button variant="heroText" size="lg" className="sm:size-xl w-full sm:w-auto" asChild>
              <Link to="/shop/men" className="flex items-center justify-center gap-2 group">
                Shop Men
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Immersive Experience Box */}
          <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md hover-lift">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/50 shrink-0">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-soft-green" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2">
                  Immersive Experience
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Experience fashion like never before, with in-store try-ons and immersive 3D virtual try-ons at your fingertips.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Image Gallery */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-slide-in-right order-1 lg:order-2">
          {/* Main large image */}
          <div className="col-span-2 overflow-hidden rounded-xl sm:rounded-2xl hover-lift">
            <img
              src={heroImage}
              alt="Featured fashion"
              className="w-full h-48 sm:h-64 lg:h-80 object-cover image-hover"
            />
          </div>
          
          {/* Smaller gallery images */}
          {galleryImages.slice(0, 4).map((img, index) => (
            <div
              key={index}
              className={cn(
                "overflow-hidden rounded-lg sm:rounded-xl hover-lift opacity-0 animate-slide-up",
                `stagger-${index + 1}`
              )}
            >
              <img
                src={img}
                alt={`Fashion ${index + 1}`}
                className="w-full h-28 sm:h-40 lg:h-48 object-cover image-hover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
