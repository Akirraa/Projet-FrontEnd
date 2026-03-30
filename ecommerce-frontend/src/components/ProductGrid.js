import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star } from 'lucide-react';

const ProductGrid = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <ShoppingCart className="w-12 h-12 text-slate-400 opacity-50" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700">No products found</h3>
        <p className="text-slate-500">Wait for products to be fetched or add new ones.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center">
            {/* Placeholder image representation */}
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
              <span className="text-3xl">📦</span>
            </div>
            {product.category && (
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 border border-indigo-100 shadow-sm">
                {product.category.name}
              </span>
            )}
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold font-mono">4.5</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[2.5rem]">
              {product.description || "Premium quality product designed for durability and modern style."}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                ${product.price}
              </span>
              <button className="p-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md active:scale-95 group/btn">
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
