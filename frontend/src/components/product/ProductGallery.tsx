import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Ensure we have at least 4 images, repeat if needed
  const allImages = images.length >= 4 
    ? images 
    : images.length === 3 
      ? [...images, images[0]]
      : images.length === 2
        ? [...images, images[0], images[1]]
        : [images[0], images[0], images[0], images[0]];
  
  // Main image (first one) and 3 thumbnails
  const mainImage = allImages[0];
  const thumbnailImages = allImages.slice(1, 4);
  
  // Get the currently displayed main image
  const getDisplayImage = () => {
    if (activeIndex === 0) {
      return mainImage;
    }
    // activeIndex 1, 2, 3 corresponds to thumbnails
    return thumbnailImages[activeIndex - 1] || mainImage;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
      {/* Main Image - Left side */}
      <button
        onClick={() => setActiveIndex(0)}
        className="flex-1 overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-md transition-shadow"
      >
        <img
          src={getDisplayImage()}
          alt="Product main view"
          className="w-full h-[500px] sm:h-[600px] lg:h-[700px] object-cover transition-all duration-500"
        />
      </button>

      {/* Thumbnail Stack - Right side, vertically stacked */}
      <div className="flex sm:flex-col gap-3 sm:gap-4 sm:w-32 lg:w-40">
        {thumbnailImages.map((img, index) => {
          const thumbnailIndex = index + 1; // Index 1, 2, 3 for thumbnails
          return (
            <button
              key={index}
              onClick={() => setActiveIndex(thumbnailIndex)}
              className={cn(
                "overflow-hidden rounded-lg transition-all duration-300 border-2",
                activeIndex === thumbnailIndex
                  ? "border-primary shadow-md scale-105"
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-border"
              )}
            >
              <img
                src={img}
                alt={`View ${thumbnailIndex + 1}`}
                className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-md"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGallery;
