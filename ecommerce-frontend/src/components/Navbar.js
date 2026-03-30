import React from 'react';
import { ShoppingCart, Package, Plus } from 'lucide-react';

const Navbar = ({ onAddClick }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
              ModernShop
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Catalog</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Collections</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Deals</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onAddClick}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all shadow-sm hover:shadow active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <div className="relative p-2 text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                0
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
