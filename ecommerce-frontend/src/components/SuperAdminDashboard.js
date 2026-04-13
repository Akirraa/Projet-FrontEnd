import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, updateUserRole, deleteUser, authLogout } from '../services/api';
import {
  Users, Shield, LogOut, PackageSearch, RefreshCw,
  Trash2, ChevronDown, UserCircle, Search, Crown, AlertTriangle
} from 'lucide-react';

const ROLES = ['ROLE_CLIENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'];

const roleLabel = (role) => {
  const map = {
    ROLE_CLIENT: 'Client',
    ROLE_ADMIN: 'Admin',
    ROLE_SUPER_ADMIN: 'Super Admin',
  };
  return map[role] || role;
};

const roleBadge = (role) => {
  const map = {
    ROLE_CLIENT: 'bg-slate-100 text-slate-600',
    ROLE_ADMIN: 'bg-indigo-100 text-indigo-700',
    ROLE_SUPER_ADMIN: 'bg-amber-100 text-amber-700',
  };
  return map[role] || 'bg-slate-100 text-slate-600';
};

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch {
      setError('Failed to update role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeletingId(userId);
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch {
      setError('Failed to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    try { await authLogout(); } catch {}
    logout();
    navigate('/login');
  };

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    roleLabel(u.role).toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Users', value: users.length, color: 'indigo' },
    { label: 'Clients', value: users.filter(u => u.role === 'ROLE_CLIENT').length, color: 'slate' },
    { label: 'Admins', value: users.filter(u => u.role === 'ROLE_ADMIN').length, color: 'violet' },
    { label: 'Super Admins', value: users.filter(u => u.role === 'ROLE_SUPER_ADMIN').length, color: 'amber' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-xl shadow shadow-amber-200">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">
            Admin<span className="text-amber-500">Hub</span>
            <span className="ml-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Super Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <UserCircle className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-700">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1 flex items-center gap-3">
              <Shield className="w-8 h-8 text-amber-500" />
              User Management
            </h1>
            <p className="text-slate-500 font-semibold">Manage all users and their roles.</p>
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black text-sm hover:border-amber-300 hover:text-amber-600 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
              <p className="text-3xl font-black text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-center gap-3 text-rose-600 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-auto text-rose-400 hover:text-rose-600">✕</button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="superadmin-search"
            type="text"
            placeholder="Search users by email or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            <h2 className="font-black text-slate-700 text-sm uppercase tracking-widest">All Users</h2>
            <span className="ml-auto text-xs font-bold text-slate-400">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-400 font-bold">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold">No users found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">#</th>
                  <th className="text-left px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Current Role</th>
                  <th className="text-left px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Change Role</th>
                  <th className="text-left px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <UserCircle className="w-5 h-5 text-indigo-500" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-black ${roleBadge(u.role)}`}>
                        {roleLabel(u.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          id={`role-select-${u.id}`}
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                          disabled={updatingId === u.id}
                          className="appearance-none bg-slate-100 border-none text-slate-700 font-bold text-sm rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition-all hover:bg-slate-200 disabled:opacity-50"
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{roleLabel(r)}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {updatingId === u.id && (
                        <span className="ml-2 text-xs text-amber-500 font-bold animate-pulse">Updating...</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        id={`delete-user-${u.id}`}
                        onClick={() => handleDelete(u.id)}
                        disabled={deletingId === u.id}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
