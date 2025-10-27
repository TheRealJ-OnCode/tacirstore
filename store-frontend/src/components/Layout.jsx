import Header from "./common/Header";
import Footer from "./common/Footer";
import { Helmet } from "react-helmet-async";
const Layout = ({ children }) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tacir Store",
    url: "https://tacir.store",
    logo: "https://tacir.store/main-logo.svg",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+994-50-345-96-37",
      contactType: "customer service",
      areaServed: "AZ",
      availableLanguage: "az",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61582783718168",
      "https://instagram.com/tacir.store",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
export default Layout;
