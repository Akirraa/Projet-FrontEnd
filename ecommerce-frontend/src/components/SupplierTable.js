import React from 'react';
import { Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';

const SupplierTable = ({ suppliers, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-widest text-xs font-black text-slate-400">
            <th className="px-6 py-4">Supplier Name</th>
            <th className="px-6 py-4">Contact Info</th>
            <th className="px-6 py-4">Address</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3 font-bold text-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-black uppercase">
                    {supplier.name?.substring(0, 2) || 'SU'}
                  </div>
                  {supplier.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Mail className="w-3 h-3 text-indigo-400" /> {supplier.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Phone className="w-3 h-3 text-emerald-400" /> {supplier.phone}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 max-w-xs line-clamp-1">
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" /> {supplier.address}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(supplier)} className="p-2 text-slate-400 hover:text-indigo-600 font-bold transition-all"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(supplier.id)} className="p-2 text-slate-400 hover:text-rose-600 font-bold transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-20 text-center text-slate-400 font-bold">
                No suppliers registered yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;
