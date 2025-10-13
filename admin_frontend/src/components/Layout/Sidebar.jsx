import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FolderTree, 
  Ruler 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'İdarə Paneli' },
  { path: '/products', icon: Package, label: 'Məhsullar' },
  { path: '/orders', icon: ShoppingCart, label: 'Sifarişlər' },
  { path: '/categories', icon: FolderTree, label: 'Kateqoriyalar' },
  { path: '/units', icon: Ruler, label: 'Ölçü Vahidləri' },
];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400">Tacir Store</h1>
        <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
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
  );
};

export default Sidebar;