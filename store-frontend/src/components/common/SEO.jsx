import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Tacir Store - Online Alış-veriş',
  description = 'Tacir Store - Keyfiyyətli məhsullar, sürətli çatdırılma',
  keywords = 'online mağaza, alış-veriş, təzə məhsullar',
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  author = 'Tacir Store',
  locale = 'az_AZ'
}) => {
  const siteName = 'Tacir Store';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const fullImageUrl = typeof window !== 'undefined' && image 
    ? (image.startsWith('http') ? image : `${window.location.origin}${image}`)
    : image;
  
  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Language & Locale */}
      <html lang="az" />
      <meta property="og:locale" content={locale} />
      
      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#B90707" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
  );
};

export default SEO;