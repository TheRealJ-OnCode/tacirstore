import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FolderTree, 
  Ruler,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'İdarə Paneli' },
    { path: '/products', icon: Package, label: 'Məhsullar' },
    { path: '/orders', icon: ShoppingCart, label: 'Sifarişlər' },
    { path: '/categories', icon: FolderTree, label: 'Kateqoriyalar' },
    { path: '/units', icon: Ruler, label: 'Ölçü Vahidləri' },
  ];

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-50
        w-64 bg-gray-900 text-white min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">Tacir Store</h1>
            <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
          </div>
          
          {/* Close button (mobile only) */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-800 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;