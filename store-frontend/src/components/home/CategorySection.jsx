import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getCategories } from '../../services/api';
import toast from 'react-hot-toast';

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      toast.error('Kateqoriyalar yüklənmədi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">Yüklənir...</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kateqoriyalar
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Məhsullarımızı kateqoriyalara görə nəzərdən keçirin
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category._id}`}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-light to-gray-100 p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                {category.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Bax</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:w-32 group-hover:h-32 transition-all duration-500"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;