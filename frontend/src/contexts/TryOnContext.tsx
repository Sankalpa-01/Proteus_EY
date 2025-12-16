import { createContext, useContext, useState, ReactNode } from "react";

interface TryOnResult {
  resultImage: string;
  modelImage: string;
  garmentImage: string;
  productName: string;
}

interface TryOnContextType {
  tryOnResult: TryOnResult | null;
  setTryOnResult: (result: TryOnResult | null) => void;
  clearTryOnResult: () => void;
}

const TryOnContext = createContext<TryOnContextType | undefined>(undefined);

export const TryOnProvider = ({ children }: { children: ReactNode }) => {
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);

  const updateTryOnResult = (result: TryOnResult | null) => {
    setTryOnResult(result);
    // Only store metadata in localStorage, not images (they're too large)
    if (result) {
      try {
        const metadata = {
          productName: result.productName,
          // Store a flag that we have a result, but not the actual images
          hasResult: true,
        };
        localStorage.setItem("tryOnResultMetadata", JSON.stringify(metadata));
      } catch (error) {
        // If localStorage fails, just continue without storing
        console.warn("Failed to save try-on metadata to localStorage:", error);
      }
    } else {
      localStorage.removeItem("tryOnResultMetadata");
    }
  };

  const clearTryOnResult = () => {
    setTryOnResult(null);
    localStorage.removeItem("tryOnResultMetadata");
  };

  return (
    <TryOnContext.Provider
      value={{
        tryOnResult,
        setTryOnResult: updateTryOnResult,
        clearTryOnResult,
      }}
    >
      {children}
    </TryOnContext.Provider>
  );
};

export const useTryOn = () => {
  const context = useContext(TryOnContext);
  if (context === undefined) {
    throw new Error("useTryOn must be used within a TryOnProvider");
  }
  return context;
};

