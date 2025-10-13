import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Truck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Keyfiyyətli Məhsullar,
              <span className="block text-light">Sürətli Çatdırılma</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-100 max-w-xl">
              Ən yaxşı qiymətlərlə keyfiyyətli məhsullar. 
              Təzə çeşid, sərfəli qiymətlər və sürətli çatdırılma.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-light transition-colors shadow-lg hover:shadow-xl"
              >
                <ShoppingBag size={20} />
                <span>İndi Al</span>
              </Link>
              
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                <span>Məhsulları Gör</span>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="text-white" size={24} />
                </div>
                <div>
                  <p className="font-semibold">Pulsuz Çatdırılma</p>
                  <p className="text-sm text-gray-200">Seçilmiş məhsullar</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <p className="font-semibold">Sərfəli Qiymət</p>
                  <p className="text-sm text-gray-200">Ən yaxşı təkliflər</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="text-white" size={24} />
                </div>
                <div>
                  <p className="font-semibold">Keyfiyyət</p>
                  <p className="text-sm text-gray-200">Təsdiqlənmiş məhsullar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image (Optional) */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=600&fit=crop"
                alt="Shopping"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;