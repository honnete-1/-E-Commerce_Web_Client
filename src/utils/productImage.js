// A massive collection of high-quality placeholder images grouped by category!
// We've expanded this list to mimic a real e-commerce platform, ensuring 
// maximum diversification so we rarely see the same image twice on one page.
const CATEGORY_IMAGES = {
  electronics: [
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop&auto=format", // Tech desk
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format", // Headphones
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop&auto=format", // Camera
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop&auto=format", // Smartwatch
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&fit=crop&auto=format", // Laptop
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop&auto=format", // Black Headphones
    "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&h=500&fit=crop&auto=format", // Keyboard
    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=500&fit=crop&auto=format", // PC Setup
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&h=500&fit=crop&auto=format", // Controller
    "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=500&h=500&fit=crop&auto=format", // Gamepad
    "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=500&h=500&fit=crop&auto=format", // Smartphone
    "https://images.unsplash.com/photo-1588702545922-7773db86d11e?w=500&h=500&fit=crop&auto=format", // Tablet
  ],
  fashion: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop&auto=format", // Fashion clothing
    "https://images.unsplash.com/photo-1434389678232-06b2a30311ea?w=500&h=500&fit=crop&auto=format", // Suit/shirt
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&auto=format", // T-shirt
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&auto=format", // Red Nike Shoe
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&auto=format", // Leather Shoes
    "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=500&h=500&fit=crop&auto=format", // Vintage shirt
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop&auto=format", // Leather Jacket
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop&auto=format", // White Tee
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop&auto=format", // Black Tee
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop&auto=format", // Tote bag
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=500&fit=crop&auto=format", // Denim
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop&auto=format", // White Sneaker
  ],
  general: [
    "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=500&h=500&fit=crop&auto=format", // General accessory
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&auto=format", // Watch
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop&auto=format", // Sunglasses
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=500&fit=crop&auto=format", // Minimalist wallet
    "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=500&h=500&fit=crop&auto=format", // Skincare/Bottle
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop&auto=format", // Essential oils
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop&auto=format", // Cosmetic
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&h=500&fit=crop&auto=format", // Notebook
    "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=500&h=500&fit=crop&auto=format", // Hair care
    "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&h=500&fit=crop&auto=format", // Backpack
    "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=500&h=500&fit=crop&auto=format", // Backpack 2
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop&auto=format", // Watch 2
  ]
};

/**
 * Gets a stable, category-aware image URL for a product.
 * We expanded the lists above so repetition is heavily minimized!
 */
export function getProductImage(product) {
  // 1. If the API gave us an image, use it right away!
  if (product?.images?.length > 0 && product.images[0]?.url) {
    return product.images[0].url;
  }

  // 2. Figure out the category string so we can pick the right image list
  // The category could be an object { name: "Electronics" } or just a string.
  const catName = typeof product?.category === "object" 
    ? (product.category.name || "")
    : String(product?.category || product?.categoryId || "");
    
  const catLower = catName.toLowerCase();

  // 3. Choose the right list of images based on keywords
  let imageList = CATEGORY_IMAGES.general;
  if (catLower.includes("electronic") || catLower.includes("tech") || catLower.includes("computer") || catLower.includes("phone") || catLower.includes("gadget")) {
    imageList = CATEGORY_IMAGES.electronics;
  } else if (catLower.includes("fashion") || catLower.includes("cloth") || catLower.includes("shoe") || catLower.includes("wear") || catLower.includes("apparel")) {
    imageList = CATEGORY_IMAGES.fashion;
  }

  // 4. We need a fallback image. We'll use the product's unique ID.
  const idStr = String(product?.id || product?._id || "unknown");

  // 5. We create a simple "hash" (a number) from the letters in the ID.
  // This means the same ID string will always produce the exact same number.
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = hash + idStr.charCodeAt(i);
  }

  // 6. We use the modulo operator (%) to safely pick an index within our chosen list!
  const imageIndex = hash % imageList.length;

  return imageList[imageIndex];
}
