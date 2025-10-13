import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Səhifə Tapılmadı
          </h2>
          <p className="text-gray-600 mb-8">
            Axtardığınız səhifə mövcud deyil və ya silinib.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Ana Səhifəyə Qayıt
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;