import { Helmet } from 'react-helmet-async';

const ProductSEO = ({ product, variants = [] }) => {
  // İlk aktiv variantı tap
  const activeVariant = variants.find(v => v.product_count > 0) || variants[0];
  
  if (!product || !activeVariant) return null;

  const price = activeVariant.product_sales_price - (activeVariant.discountAmount || 0);
  const inStock = activeVariant.product_count > 0;

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.product_name,
    "image": product.product_images || [],
    "description": product.product_description || `${product.product_name} - Tacir Store'da sifariş edin`,
    "sku": activeVariant.skus?.[0] || activeVariant._id,
    "brand": {
      "@type": "Brand",
      "name": product.product_company || "Tacir Store"
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "priceCurrency": "AZN",
      "price": price.toFixed(2),
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Tacir Store"
      }
    }
  };

  // Əgər endirim varsa
  if (activeVariant.discountAmount > 0) {
    structuredData.offers.price = price.toFixed(2);
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default ProductSEO;