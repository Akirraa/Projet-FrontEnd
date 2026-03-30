import React from 'react';
import { Edit, Trash2, ImageIcon } from 'lucide-react';

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Product</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Supplier</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Price</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-indigo-50/30 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 group-hover:border-indigo-200 transition-colors">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{product.name}</p>
                    <p className="text-xs font-medium text-slate-400 line-clamp-1 max-w-[200px]">{product.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
                  {product.category?.name || 'Uncategorized'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-bold text-slate-600">
                  {product.supplier?.name || 'No Supplier'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-black text-slate-900 font-mono tracking-tight">${product.price}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(product)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all font-bold"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-bold">
                No products found. Add your first product to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
