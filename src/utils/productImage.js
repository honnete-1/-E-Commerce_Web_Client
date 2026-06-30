// My placeholder image pool, grouped by category to avoid repetition
const CATEGORY_IMAGES = {
  electronics: [
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1588702545922-7773db86d11e?w=500&h=500&fit=crop&auto=format",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1434389678232-06b2a30311ea?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop&auto=format",
  ],
  general: [
    "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop&auto=format",
  ]
};

// I return a stable, category-aware image URL for a product
export function getProductImage(product) {
  // I use the API image right away if one exists
  if (product?.images?.length > 0 && product.images[0]?.url) {
    return product.images[0].url;
  }

  // I read the category whether it's an object or a plain string
  const catName = typeof product?.category === "object" 
    ? (product.category.name || "")
    : String(product?.category || product?.categoryId || "");
    
  const catLower = catName.toLowerCase();

  // I pick the matching image list based on category keywords
  let imageList = CATEGORY_IMAGES.general;
  if (catLower.includes("electronic") || catLower.includes("tech") || catLower.includes("computer") || catLower.includes("phone") || catLower.includes("gadget")) {
    imageList = CATEGORY_IMAGES.electronics;
  } else if (catLower.includes("fashion") || catLower.includes("cloth") || catLower.includes("shoe") || catLower.includes("wear") || catLower.includes("apparel")) {
    imageList = CATEGORY_IMAGES.fashion;
  }

  // I fall back to a hash of the product ID so the image stays stable
  const idStr = String(product?.id || product?._id || "unknown");

  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = hash + idStr.charCodeAt(i);
  }

  const imageIndex = hash % imageList.length;

  return imageList[imageIndex];
}
