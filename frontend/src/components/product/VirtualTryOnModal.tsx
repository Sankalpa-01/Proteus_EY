import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Camera, User } from "lucide-react";

interface VirtualTryOnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productImage: string;
  productName: string;
}

const VirtualTryOnModal = ({
  open,
  onOpenChange,
  productImage,
  productName,
}: VirtualTryOnModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleTryOn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 2000);
  };

  const handleReset = () => {
    setShowResult(false);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-soft-green" />
            Virtual Try-On
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-4">
          <p className="text-muted-foreground text-sm mb-4">
            Powered by Recommendation Agent - See how {productName} looks on you
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Model Preview */}
            <div className="relative aspect-[3/4] bg-gradient-to-b from-muted/50 to-muted rounded-xl overflow-hidden border border-border">
              {!showResult ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-32 h-48 rounded-full bg-muted-foreground/10 flex items-center justify-center mb-4">
                    <User className="h-20 w-20 text-muted-foreground/30" />
                  </div>
                  <p className="text-muted-foreground text-sm">3D Model Preview</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Simulated avatar with product overlay */}
                    <div className="w-40 h-56 bg-gradient-to-b from-muted-foreground/20 to-muted-foreground/30 rounded-xl flex items-center justify-center">
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-36 h-48 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-soft-green text-foreground text-xs px-3 py-1 rounded-full font-medium">
                      AI Generated Preview
                    </div>
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-soft-green border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm text-muted-foreground">Processing...</p>
                </div>
              )}
            </div>

            {/* Product Image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border">
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-background/90 backdrop-blur-sm rounded-lg p-2">
                <p className="text-xs font-medium text-foreground truncate">{productName}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {!showResult ? (
              <Button
                onClick={handleTryOn}
                disabled={isLoading}
                className="flex-1"
                variant="action"
              >
                <Camera className="h-4 w-4 mr-2" />
                {isLoading ? "Processing..." : "Try On Now"}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => onOpenChange(false)}
                  variant="action"
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            This is a simulated preview. Actual results may vary.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VirtualTryOnModal;
