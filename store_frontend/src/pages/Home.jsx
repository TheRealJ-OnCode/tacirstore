import Layout from '../components/Layout';
import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';

const Home = () => {
  return (
    <Layout>
      <SEO 
        title="Ana Səhifə"
        description="Tacir Store - Keyfiyyətli məhsullar, sürətli çatdırılma. Ən yaxşı qiymətlərlə online alış-veriş."
        keywords="online mağaza, alış-veriş, sürətli çatdırılma, keyfiyyətli məhsullar"
      />
      
      <Hero />
      <CategorySection />
      <FeaturedProducts />
    </Layout>
  );
};

export default Home;