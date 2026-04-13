import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, UserCircle } from 'lucide-react';

const roleDisplayName = (role) => {
  if (role === 'ROLE_SUPER_ADMIN') return 'Super Admin';
  if (role === 'ROLE_ADMIN') return 'Admin';
  return 'Client';
};

const DashboardLayout = ({ children, activeView, setActiveView }) => {
  const { user } = useAuth();

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="relative w-96 font-medium">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search administration..." 
              className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 leading-none">{user?.email || 'Admin User'}</p>
                <p className="text-xs font-semibold text-indigo-600">{roleDisplayName(user?.role)}</p>
              </div>
              <div className="bg-indigo-100 p-1.5 rounded-xl group-hover:scale-110 transition-transform">
                <UserCircle className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

