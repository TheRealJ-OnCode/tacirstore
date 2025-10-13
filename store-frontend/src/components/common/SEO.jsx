import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Tacir Store - Online Alış-veriş',
  description = 'Tacir Store - Keyfiyyətli məhsullar, sürətli çatdırılma',
  keywords = 'online mağaza, alış-veriş, təzə məhsullar',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website'
}) => {
  const siteName = 'Tacir Store';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;