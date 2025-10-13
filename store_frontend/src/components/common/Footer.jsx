import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <img 
              src="/main-logo.svg" 
              alt="Tacir Store" 
              className="h-10 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm text-gray-400">
              Keyfiyyətli məhsullar, sürətli çatdırılma. 
              Sizin etibar etdiyiniz online mağaza.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sürətli Keçidlər</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Məhsullar
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="hover:text-primary transition-colors">
                  Sipariş Takibi
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  Haqqımızda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Əlaqə</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">+994 50 345 96 37</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">info@tacirstore.az</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">Ismayıllı, Azərbaycan</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sosial Şəbəkələr</h3>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tacir Store. Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;