import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import { getProductById, allProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the product by ID
  const productId = parseInt(id || "1", 10);
  const product = getProductById(productId);

  // Fallback if product not found
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to collection
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left - Gallery */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <ProductGallery images={product.images} />
          </div>

          {/* Right - Details */}
          <div className="opacity-0 animate-slide-in-right" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <ProductDetails 
              product={product} 
              productImage={product.images[0]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
