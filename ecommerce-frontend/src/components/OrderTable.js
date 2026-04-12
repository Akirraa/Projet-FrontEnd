import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';

const OrderTable = ({ orders, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Associated Cart</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Products Count</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-indigo-200 transition-colors">
                    <ShoppingBag className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Order #{order.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                  {order.cart ? `Cart #${order.cart.id}` : 'No Cart Attached'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-black text-slate-900 font-mono tracking-tight">
                  {order.products?.length || 0}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onDelete(order.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-20 text-center text-slate-400 font-bold">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
