import { Bell, User, Menu } from "lucide-react";

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-30">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <input
            type="text"
            placeholder="Axtar..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User */}
          <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
            <User size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;