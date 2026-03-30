import React from 'react';
import { Edit2, Trash, Hash } from 'lucide-react';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">ID</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Category Name</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 font-medium">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-600 font-mono text-sm">
                  <Hash className="w-3 h-3" /> {category.id}
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-slate-800">{category.name}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(category)}
                    className="p-2 text-slate-400 hover:text-indigo-600 font-bold"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(category.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 font-bold"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="3" className="px-6 py-20 text-center text-slate-400 font-bold">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
