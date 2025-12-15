/**
 * Virtual Try-On API Service
 * Uses Replicate API with OOTDiffusion model for high-quality virtual try-on
 */

export interface TryOnRequest {
  modelImage: string; // Base64 encoded image of the person
  garmentImage: string; // Base64 encoded image of the clothing item
}

export interface TryOnResponse {
  success: boolean;
  resultImage?: string; // URL or base64 of the result
  error?: string;
  taskId?: string;
}

/**
 * Convert file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix if present
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Upload image to a temporary hosting service and get URL
 * This is needed because Replicate API requires URLs, not base64
 */
const uploadImageToTempHost = async (base64Image: string): Promise<string> => {
  try {
    // Convert base64 to blob
    const base64Data = base64Image.includes(',') 
      ? base64Image.split(',')[1] 
      : base64Image;
    
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    // Use imgbb.com as a free image hosting service
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');
    
    const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!imgbbKey || imgbbKey === 'YOUR_IMGBB_KEY') {
      // If no key, try using a data URL (may not work with all APIs)
      return `data:image/jpeg;base64,${base64Image}`;
    }
    
    const imgbbResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (!imgbbResponse.ok) {
      throw new Error('Failed to upload image');
    }
    
    const imgbbData = await imgbbResponse.json();
    return imgbbData.data?.url || `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    // Fallback to data URL
    return `data:image/jpeg;base64,${base64Image}`;
  }
};

/**
 * Alternative: Use a mock/demo API for development
 * In production, replace this with a real virtual try-on API
 */
export const tryOnWithMockAPI = async (
  modelImage: File,
  garmentImage: string
): Promise<TryOnResponse> => {
  try {
    // For demo purposes, we'll create a canvas-based composition
    // In production, replace this with actual API call
    
    // Convert images to canvas and composite them
    const modelBase64 = await fileToBase64(modelImage);
    const modelImg = new Image();
    const garmentImg = new Image();
    
    return new Promise((resolve) => {
      modelImg.onload = () => {
        garmentImg.src = garmentImage;
        garmentImg.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = modelImg.width;
          canvas.height = modelImg.height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Draw model image
            ctx.drawImage(modelImg, 0, 0);
            // Overlay garment (simplified - real API would do proper segmentation)
            ctx.globalAlpha = 0.7;
            ctx.drawImage(garmentImg, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
            
            const resultUrl = canvas.toDataURL('image/png');
            resolve({
              success: true,
              resultImage: resultUrl
            });
          } else {
            resolve({
              success: false,
              error: 'Failed to create canvas context'
            });
          }
        };
        garmentImg.onerror = () => {
          resolve({
            success: false,
            error: 'Failed to load garment image'
          });
        };
      };
      modelImg.src = `data:image/jpeg;base64,${modelBase64}`;
      modelImg.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to load model image'
        });
      };
    });
  } catch (error) {
    console.error('Mock API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process try-on'
    };
  }
};

/**
 * Use Replicate API for virtual try-on (more reliable, requires API key)
 * Uses the IDM-VTON model which is excellent for virtual try-on
 */
export const tryOnWithReplicate = async (
  modelImage: File,
  garmentImageUrl: string
): Promise<TryOnResponse> => {
  try {
    const replicateApiKey = import.meta.env.VITE_REPLICATE_API_KEY;
    
    if (!replicateApiKey || replicateApiKey === 'YOUR_REPLICATE_API_KEY') {
      throw new Error('Replicate API key not configured');
    }

    // Convert model image to base64 and upload
    const modelBase64 = await fileToBase64(modelImage);
    const modelImageUrl = await uploadImageToTempHost(modelBase64);

    // Ensure garment image is also a URL
    let garmentUrl = garmentImageUrl;
    if (garmentImageUrl.startsWith('data:')) {
      const garmentBase64 = garmentImageUrl.split(',')[1] || garmentImageUrl;
      garmentUrl = await uploadImageToTempHost(garmentBase64);
    }

    // Use IDM-VTON model - one of the best for virtual try-on
    // Model: https://replicate.com/yisol/IDM-VTON
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${replicateApiKey}`
      },
      body: JSON.stringify({
        version: '9a671468b8b3c0c5e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e', // IDM-VTON model version - update with actual version
        input: {
          human: modelImageUrl,
          garment: garmentUrl,
          is_checked: true,
          category: 'upper_body'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || `Replicate API error: ${response.status}`);
    }

    const prediction = await response.json();
    
    // Poll for result (max 2 minutes)
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 120;
    
    while ((result.status === 'starting' || result.status === 'processing') && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            'Authorization': `Token ${replicateApiKey}`
          }
        }
      );
      
      if (!statusResponse.ok) {
        throw new Error(`Failed to check prediction status: ${statusResponse.status}`);
      }
      
      result = await statusResponse.json();
      attempts++;
    }

    if (result.status === 'succeeded' && result.output) {
      const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;
      return {
        success: true,
        resultImage: outputUrl,
        taskId: result.id
      };
    } else if (result.status === 'failed') {
      throw new Error(result.error || 'Prediction failed');
    } else {
      throw new Error('Prediction timed out or is still processing');
    }
  } catch (error) {
    console.error('Replicate API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process try-on'
    };
  }
};

/**
 * Main try-on function - tries Replicate first, falls back to Hugging Face
 */
export const performVirtualTryOn = async (
  modelImage: File,
  garmentImageUrl: string
): Promise<TryOnResponse> => {
  // Try Replicate first if API key is available
  if (import.meta.env.VITE_REPLICATE_API_KEY) {
    const result = await tryOnWithReplicate(modelImage, garmentImageUrl);
    if (result.success) {
      return result;
    }
    // If Replicate fails, fall back to Hugging Face
  }

  // Fallback to Hugging Face
  return tryOnWithHuggingFace(modelImage, garmentImageUrl);
};

