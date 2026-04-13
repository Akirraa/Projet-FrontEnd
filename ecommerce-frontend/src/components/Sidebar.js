import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authLogout } from '../services/api';
import { LayoutDashboard, Package, Tag, Users, Settings, LogOut, PackageSearch, ShoppingBag, ShoppingCart, Store } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'carts', label: 'Carts', icon: ShoppingCart },
  ];

  const handleLogout = async () => {
    try { await authLogout(); } catch {}
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
          <PackageSearch className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-black text-slate-800 tracking-tight">Admin<span className="text-indigo-600">Hub</span></span>
      </div>

      <div className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeView === item.id
                ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}

        {/* Quick link to Client Shop */}
        <button
          onClick={() => navigate('/client')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
        >
          <Store className="w-5 h-5" />
          View Shop
        </button>
      </div>

      <div className="p-4 border-t border-slate-100 space-y-1">
        {/* User info */}
        {user && (
          <div className="px-4 py-3 mb-1">
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Signed in as</p>
            <p className="text-sm font-bold text-slate-700 truncate mt-0.5">{user.email}</p>
          </div>
        )}
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

