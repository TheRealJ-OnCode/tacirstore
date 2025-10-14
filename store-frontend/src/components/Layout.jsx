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
      telephone: "+994-XX-XXX-XX-XX",
      contactType: "customer service",
      areaServed: "AZ",
      availableLanguage: "az",
    },
    sameAs: [
      "https://facebook.com/tacirstore",
      "https://instagram.com/tacirstore",
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
