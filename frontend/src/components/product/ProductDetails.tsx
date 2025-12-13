import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Home, ShoppingBag, Zap, Sparkles, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import VirtualTryOnModal from "./VirtualTryOnModal";
import StoreLocatorModal from "./StoreLocatorModal";
import MixMatchGallery from "./MixMatchGallery";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

interface ProductDetailsProps {
  product: {
    id?: number;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    reviews: string;
    stock: number;
    sizes: string[];
  };
  productImage?: string;
  mixMatchImage?: string;
}

const ProductDetails = ({ product, productImage, mixMatchImage }: ProductDetailsProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleViewProduct = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = () => {
    // Check if size is selected
    if (!selectedSize) {
      toast.error("Please select a size", {
        description: "Choose your preferred size before adding to bag",
      });
      return;
    }

    // Show loading state
    setIsAddingToCart(true);

    // Simulate adding to cart (would be API call in production)
    setTimeout(() => {
      addToCart({
        id: product.id || 1,
        name: product.name,
        price: product.price,
        size: selectedSize,
        quantity: 1,
        image: productImage || "",
      });

      setIsAddingToCart(false);
      setJustAdded(true);

      toast.success(`${product.name} has been added to your bag!`, {
        description: `Size: ${selectedSize} • ₹${product.price.toLocaleString()}`,
      });

      // Reset the "just added" state after 2 seconds
      setTimeout(() => setJustAdded(false), 2000);
    }, 600);
  };

  const handleSuggestionAddToCart = (productId: number) => {
    toast.success("Added to cart!", {
      description: "Suggested item has been added to your shopping bag",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Try It On Badge - Clickable */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowTryOnModal(true)}
          className="animate-float focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
        >
          <div className="bg-gradient-to-r from-soft-green to-accent px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg flex items-center gap-2 hover:shadow-xl transition-shadow cursor-pointer">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-accent-foreground" />
            <span className="text-xs sm:text-sm font-medium text-accent-foreground">Try it on</span>
          </div>
        </button>
      </div>

      {/* Product Name */}
      <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground">
        {product.name}
      </h1>

      {/* Price Section */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <span className="text-2xl sm:text-3xl font-semibold text-foreground">
          ₹{product.price.toLocaleString()}
        </span>
        <span className="text-base sm:text-lg text-muted-foreground line-through">
          ₹{product.originalPrice.toLocaleString()}
        </span>
        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-soft-green/20 text-soft-green text-xs sm:text-sm font-medium rounded-full">
          {product.discount}% off
        </span>
      </div>

      {/* Stock & Reviews */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <span className="text-xs sm:text-sm font-medium text-destructive">
          Only {product.stock} left!
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3 sm:h-4 sm:w-4",
                  i < Math.floor(product.rating)
                    ? "fill-gold text-gold"
                    : "text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {product.rating} ({product.reviews} REVIEWS)
          </span>
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-2 sm:space-y-3">
        <label className="text-xs sm:text-sm font-medium text-foreground">Select Size</label>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {product.sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "sizeActive" : "size"}
              size="sm"
              className="min-w-[40px] sm:min-w-[48px]"
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* In-Store Try On - Clickable Store Locator */}
      <button
        onClick={() => setShowStoreModal(true)}
        className="w-full glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="p-1.5 sm:p-2 rounded-lg bg-accent/50 shrink-0">
          <Home className="h-4 w-4 sm:h-5 sm:w-5 text-soft-green" />
        </div>
        <div className="text-left flex-1">
          <span className="font-medium text-foreground text-xs sm:text-sm">IN-STORE TRY ON</span>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Find stores near you • Click to view locations</p>
        </div>
        <span className="text-primary text-xs font-medium">View →</span>
      </button>

      {/* Mix & Match Gallery */}
      <MixMatchGallery
        currentProductName={product.name}
        onViewProduct={handleViewProduct}
        onAddToCart={handleSuggestionAddToCart}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
        <Button 
          variant={justAdded ? "default" : "actionOutline"}
          size="lg" 
          className={cn(
            "flex-1 text-sm sm:text-base transition-all duration-300",
            justAdded && "bg-soft-green text-foreground hover:bg-soft-green/90"
          )}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
              Adding...
            </>
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Added!
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Add to Bag!
            </>
          )}
        </Button>
        <Button variant="action" size="lg" className="flex-1 text-sm sm:text-base">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Buy Now!
        </Button>
      </div>

      {/* Virtual Try-On Modal */}
      <VirtualTryOnModal
        open={showTryOnModal}
        onOpenChange={setShowTryOnModal}
        productImage={productImage || ""}
        productName={product.name}
      />

      {/* Store Locator Modal */}
      <StoreLocatorModal
        open={showStoreModal}
        onOpenChange={setShowStoreModal}
      />
    </div>
  );
};

export default ProductDetails;
