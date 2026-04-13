import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts, getCategories } from '../services/api';
import { authLogout } from '../services/api';
import {
  ShoppingCart, Star, Search, Filter, PackageSearch,
  LogOut, ShoppingBag, Trash2, Plus, Minus, X, UserCircle, CheckCircle
} from 'lucide-react';

const CART_KEY = 'clientCart';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const cartTotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleOrder = () => {
    if (!user) {
      // Save cart and redirect to login
      navigate('/login');
      return;
    }
    // Order is authenticated
    setOrderSuccess(true);
    setCart([]);
    setCartOpen(false);
    setTimeout(() => setOrderSuccess(false), 4000);
  };

  const handleLogout = async () => {
    try { await authLogout(); } catch {}
    logout();
    navigate('/login');
  };

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category?.id?.toString() === selectedCategory;
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Order Success Toast */}
      {orderSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white rounded-2xl px-8 py-4 flex items-center gap-3 shadow-2xl shadow-emerald-900/30 animate-bounce-in">
          <CheckCircle className="w-5 h-5" />
          <span className="font-black">Order placed successfully!</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow shadow-indigo-200">
            <PackageSearch className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">
            Admin<span className="text-indigo-600">Hub</span>
            <span className="ml-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Shop</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <UserCircle className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-slate-700">{user?.email}</span>
          </div>

          <button
            id="client-cart-btn"
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-white h-full flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-bold">Your cart is empty</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                    <p className="text-indigo-600 font-black text-sm">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1 rounded-lg hover:bg-slate-200 transition-all">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-black text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1 rounded-lg hover:bg-slate-200 transition-all">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-1 text-rose-400 hover:bg-rose-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100">
              <div className="flex justify-between mb-4">
                <span className="font-bold text-slate-500">Total</span>
                <span className="font-black text-2xl text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                id="client-order-btn"
                onClick={handleOrder}
                disabled={cart.length === 0}
                className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-100"
              >
                <ShoppingBag className="w-5 h-5" />
                {user ? 'Place Order' : 'Login to Order'}
              </button>
              {!user && (
                <p className="text-center text-xs text-slate-400 font-semibold mt-3">
                  You'll be redirected to login. Your cart will be saved.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Browse Products</h1>
          <p className="text-slate-500 font-semibold">Discover and shop our curated collection.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="client-search"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm flex-shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm flex-shrink-0 transition-all ${
                  selectedCategory === cat.id.toString()
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="font-black text-xl">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(product => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl">📦</span>
                  </div>
                  {product.category && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-indigo-600 shadow-sm">
                      {product.category.name}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-black text-slate-800 text-sm mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mb-3 line-clamp-2 min-h-[2rem]">
                    {product.description || 'Premium quality product.'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-lg text-slate-900">${product.price}</span>
                    <button
                      id={`add-to-cart-${product.id}`}
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-200"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;
