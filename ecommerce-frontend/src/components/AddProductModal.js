import React, { useState, useEffect } from 'react';
import { X, Plus, Package, Tag, DollarSign, AlignLeft, Link, Truck, ShoppingBag, ShoppingCart } from 'lucide-react';
import { addProduct, addCategory, addSupplier, getSuppliers, getCategories, getProducts, getCarts, getOrders, addOrder, addCart } from '../services/api';

const AddProductModal = ({ isOpen, onClose, onRefresh, initialTab = 'product' }) => {
  const [activeTab, setActiveTab ] = useState(initialTab);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading ] = useState(false);

  // Form States
  const [productData, setProductData ] = useState({ name: '', price: '', description: '', imageUrl: '', categoryId: '', supplierId: '' });
  const [categoryName, setCategoryName ] = useState('');
  const [supplierData, setSupplierData ] = useState({ name: '', email: '', phone: '', address: '' });
  
  const [orderCartId, setOrderCartId] = useState('');
  const [orderProductIds, setOrderProductIds] = useState([]);
  const [cartOrderIds, setCartOrderIds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchRefs();
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const fetchRefs = async () => {
    try {
      const [catRes, supRes, prodRes, cartRes, orderRes] = await Promise.all([getCategories(), getSuppliers(), getProducts(), getCarts(), getOrders()]);
      setCategories(catRes.data);
      setSuppliers(supRes.data);
      setProducts(prodRes.data || []);
      setCarts(cartRes.data || []);
      setOrders(orderRes.data || []);
    } catch (err) { console.error(err); }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addProduct({
        ...productData,
        price: parseInt(productData.price),
        category: productData.categoryId ? { id: parseInt(productData.categoryId) } : null,
        supplier: productData.supplierId ? { id: parseInt(productData.supplierId) } : null
      });
      onRefresh();
      onClose();
    } catch (err) { alert('Error adding product'); }
    finally { setLoading(false); }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCategory({ name: categoryName });
      onRefresh();
      onClose();
    } catch (err) { alert('Error adding category'); }
    finally { setLoading(false); }
  };

  const handleSubmitSupplier = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addSupplier(supplierData);
      onRefresh();
      onClose();
    } catch (err) { alert('Error adding supplier'); }
    finally { setLoading(false); }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addOrder({
        cart: orderCartId ? { id: parseInt(orderCartId) } : null,
        products: orderProductIds.map(id => ({ id: parseInt(id) }))
      });
      onRefresh();
      onClose();
    } catch (err) { alert('Error adding order'); }
    finally { setLoading(false); }
  };

  const handleSubmitCart = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCart({
        orders: cartOrderIds.map(id => ({ id: parseInt(id) }))
      });
      onRefresh();
      onClose();
    } catch (err) { alert('Error adding cart'); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col scale-in-center transition-all duration-500">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Resource Management</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Inventory Control Panel</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 rounded-2xl transition-all">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex bg-slate-100/80 p-1.5 m-6 rounded-2xl overflow-x-auto hide-scrollbar">
          {['product', 'category', 'supplier', 'order', 'cart'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm outline outline-1 outline-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab === 'product' && <Package className="w-4 h-4" />}
              {tab === 'category' && <Tag className="w-4 h-4" />}
              {tab === 'supplier' && <Truck className="w-4 h-4" />}
              {tab === 'order' && <ShoppingBag className="w-4 h-4" />}
              {tab === 'cart' && <ShoppingCart className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8 pt-0 overflow-y-auto max-h-[60vh]">
          {activeTab === 'product' && (
            <form onSubmit={handleSubmitProduct} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label-style">Product Name</label>
                  <input required type="text" className="input-field-new" placeholder="e.g. MacBook Pro M3" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} />
                </div>
                <div>
                  <label className="label-style">Price ($)</label>
                  <input required type="number" className="input-field-new" placeholder="1999" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} />
                </div>
                <div>
                  <label className="label-style">Image URL</label>
                  <input type="text" className="input-field-new" placeholder="https://..." value={productData.imageUrl} onChange={e => setProductData({...productData, imageUrl: e.target.value})} />
                </div>
                <div>
                  <label className="label-style">Category</label>
                  <select className="input-field-new appearance-none" value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value})}>
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-style">Supplier</label>
                  <select className="input-field-new appearance-none" value={productData.supplierId} onChange={e => setProductData({...productData, supplierId: e.target.value})}>
                    <option value="">Select...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label-style">Description</label>
                <textarea className="input-field-new min-h-[100px] resize-none" placeholder="Product details..." value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 mt-4">
                {loading ? 'Processing...' : 'Create Product'}
              </button>
            </form>
          )}

          {activeTab === 'category' && (
            <form onSubmit={handleSubmitCategory} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="label-style">Category Name</label>
                <input required type="text" className="input-field-new text-lg" placeholder="e.g. Home Appliances" value={categoryName} onChange={e => setCategoryName(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-200">
                {loading ? 'Processing...' : 'Add Category'}
              </button>
            </form>
          )}

          {activeTab === 'supplier' && (
            <form onSubmit={handleSubmitSupplier} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label-style">Supplier Name</label>
                  <input required type="text" className="input-field-new" placeholder="Global Tech Corp" value={supplierData.name} onChange={e => setSupplierData({...supplierData, name: e.target.value})} />
                </div>
                <div>
                  <label className="label-style">Email Address</label>
                  <input required type="email" className="input-field-new" placeholder="contact@global.com" value={supplierData.email} onChange={e => setSupplierData({...supplierData, email: e.target.value})} />
                </div>
                <div>
                  <label className="label-style">Phone Number</label>
                  <input required type="text" className="input-field-new" placeholder="+1 234..." value={supplierData.phone} onChange={e => setSupplierData({...supplierData, phone: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="label-style">Business Address</label>
                  <input required type="text" className="input-field-new" placeholder="123 Science Park, Silicon Valley" value={supplierData.address} onChange={e => setSupplierData({...supplierData, address: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 mt-4">
                {loading ? 'Processing...' : 'Register Supplier'}
              </button>
            </form>
          )}

          {activeTab === 'order' && (
            <form onSubmit={handleSubmitOrder} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="label-style">Assign to Cart</label>
                <select className="input-field-new appearance-none" value={orderCartId} onChange={e => setOrderCartId(e.target.value)}>
                  <option value="">No Cart</option>
                  {carts.map(c => <option key={c.id} value={c.id}>Cart #{c.id}</option>)}
                </select>
              </div>
              <div className="pt-2">
                <label className="label-style">Select Products</label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {products.length === 0 ? (
                    <p className="text-xs font-bold text-slate-400 p-4 text-center bg-slate-50 rounded-xl border border-slate-100">No products available. Add some first!</p>
                  ) : products.map(p => (
                    <label key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${orderProductIds.includes(p.id) ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100'}`}>
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                        checked={orderProductIds.includes(p.id)}
                        onChange={(e) => {
                          if (e.target.checked) setOrderProductIds([...orderProductIds, p.id]);
                          else setOrderProductIds(orderProductIds.filter(id => id !== p.id));
                        }}
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{p.name}</p>
                        <p className="text-xs font-black text-slate-500">${p.price}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 mt-4">
                {loading ? 'Processing...' : 'Create Order'}
              </button>
            </form>
          )}

          {activeTab === 'cart' && (
            <form onSubmit={handleSubmitCart} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div className="pt-2">
                <label className="label-style">Select Orders</label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {orders.length === 0 ? (
                    <p className="text-xs font-bold text-slate-400 p-4 text-center bg-slate-50 rounded-xl border border-slate-100">No orders available. Add some first!</p>
                  ) : orders.map(o => (
                    <label key={o.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${cartOrderIds.includes(o.id) ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100'}`}>
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                        checked={cartOrderIds.includes(o.id)}
                        onChange={(e) => {
                          if (e.target.checked) setCartOrderIds([...cartOrderIds, o.id]);
                          else setCartOrderIds(cartOrderIds.filter(id => id !== o.id));
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">Order #{o.id}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 mt-4">
                {loading ? 'Processing...' : 'Create Cart'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .label-style { @apply block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-l-2 border-indigo-500 pl-2; }
        .input-field-new { @apply w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800 placeholder:text-slate-300; }
      `}</style>
    </div>
  );
};

export default AddProductModal;
