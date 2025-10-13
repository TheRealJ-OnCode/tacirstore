import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = useCart((state) => state.getItemCount());

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/main-logo.svg" 
              alt="Tacir Store" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Search */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Məhsul axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-light rounded-lg transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Məhsullar
            </Link>
            
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Məhsul axtar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-2">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:bg-light hover:text-primary rounded-lg transition-colors"
              >
                Məhsullar
              </Link>
              
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:bg-light hover:text-primary rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Səbət</span>
                {itemCount > 0 && (
                  <span className="bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;