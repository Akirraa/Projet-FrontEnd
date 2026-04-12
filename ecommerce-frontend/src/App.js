import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import ProductTable from './components/ProductTable';
import CategoryTable from './components/CategoryTable';
import SupplierTable from './components/SupplierTable';
import OrderTable from './components/OrderTable';
import CartTable from './components/CartTable';
import AddProductModal from './components/AddProductModal';
import { getProducts, getCategories, getSuppliers, deleteProduct, deleteCategory, deleteSupplier, getOrders, getCarts, addOrder, addCart, deleteOrder, deleteCart } from './services/api';
import { Package, Tag, Users, LayoutDashboard, Plus, RefreshCw, Layers, ShoppingBag, ShoppingCart } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState('overview');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('product');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [p, c, s, o, cr] = await Promise.all([getProducts(), getCategories(), getSuppliers(), getOrders(), getCarts()]);
      setProducts(p.data);
      setCategories(c.data);
      setSuppliers(s.data);
      setOrders(o.data);
      setCarts(cr.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      if (type === 'product') await deleteProduct(id);
      if (type === 'category') await deleteCategory(id);
      if (type === 'supplier') await deleteSupplier(id);
      if (type === 'order') await deleteOrder(id);
      if (type === 'cart') await deleteCart(id);
      fetchAllData();
    } catch (err) {
      alert(`Failed to delete ${type}. It might be linked to other records.`);
    }
  };

  const openModal = (tab) => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Products', value: products.length, icon: Package, color: 'indigo' },
          { label: 'Total Categories', value: categories.length, icon: Tag, color: 'emerald' },
          { label: 'Total Suppliers', value: suppliers.length, icon: Users, color: 'rose' },
          { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'blue' },
          { label: 'Total Carts', value: carts.length, icon: ShoppingCart, color: 'teal' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
            <div className={`bg-${stat.color}-50 p-4 rounded-3xl group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4 tracking-tight">Manage your entire <br/> inventory in one place.</h2>
          <p className="text-indigo-100 font-bold max-w-md mb-8">Efficiently track products, categories, and suppliers with our new administration suite.</p>
          <div className="flex gap-4">
            <button onClick={() => setActiveView('products')} className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10">Explore Products</button>
            <button onClick={() => openModal('product')} className="px-8 py-4 bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-400 transition-all border border-indigo-400/30">Quick Add</button>
          </div>
        </div>
        <Layers className="absolute -bottom-12 -right-12 w-64 h-64 text-white/10 rotate-12" />
      </div>
    </div>
  );

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter capitalize">{activeView}</h1>
          <p className="text-slate-400 font-bold flex items-center gap-2 mt-1">
            <LayoutDashboard className="w-4 h-4" /> Administration Panel
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAllData}
            className="p-4 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {activeView !== 'overview' && (
            <button 
              onClick={() => openModal(activeView.slice(0, -1))}
              className="flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add {activeView.slice(0, -1)}
            </button>
          )}
        </div>
      </div>

      <div className="min-h-[400px]">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'products' && <ProductTable products={products} onDelete={id => handleDelete('product', id)} onEdit={() => {}} />}
        {activeView === 'categories' && <CategoryTable categories={categories} onDelete={id => handleDelete('category', id)} onEdit={() => {}} />}
        {activeView === 'suppliers' && <SupplierTable suppliers={suppliers} onDelete={id => handleDelete('supplier', id)} onEdit={() => {}} />}
        {activeView === 'orders' && <OrderTable orders={orders} onDelete={id => handleDelete('order', id)} />}
        {activeView === 'carts' && <CartTable carts={carts} onDelete={id => handleDelete('cart', id)} />}
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchAllData} 
        initialTab={modalTab}
      />
    </DashboardLayout>
  );
}

export default App;
