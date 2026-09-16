import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProduct } from '../context/ProductContext';
import {
  ChevronDown,
  LogOut,
  ExternalLink,
  BookOpen,
  Plus,
  Layers,
  Sparkles
} from 'lucide-react';

export const Navbar = ({ onOpenCreateStory }) => {
  const { user, logout, hasRole } = useAuth();
  const { products, selectedProduct, selectProduct } = useProduct();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const canCreate = hasRole('ADMIN', 'PRODUCT_MANAGER');

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Product Selector */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition text-xs font-semibold text-slate-800"
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="max-w-[180px] truncate">
              {selectedProduct ? selectedProduct.name : 'Select Product'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setDropdownOpen(false)}
              ></div>
              <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 divide-y divide-slate-100">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Active Product
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        selectProduct(p);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                        selectedProduct?.id === p.id ? 'font-bold text-indigo-600 bg-indigo-50/40' : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{p.status}</span>
                    </button>
                  ))}
                </div>
                <div className="p-2">
                  <a
                    href="/products"
                    className="block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-1 rounded hover:bg-indigo-50/50 transition"
                  >
                    + Manage All Products
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {selectedProduct?.targetReleaseDate && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Target Release:</span>
            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
              {selectedProduct.targetReleaseDate}
            </span>
          </div>
        )}
      </div>

      {/* Right: Actions, Docs, Profile */}
      <div className="flex items-center gap-3">
        {/* Swagger Docs Link */}
        <a
          href="/swagger-ui.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          title="Open OpenAPI Swagger Documentation"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>API Docs</span>
          <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
        </a>

        {/* AI Story Generator Quick Action */}
        <a
          href="/ai-assistant"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-lg transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">AI Story Assistant</span>
        </a>

        {/* Create Story Button */}
        {canCreate && onOpenCreateStory && (
          <button
            onClick={onOpenCreateStory}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Story</span>
          </button>
        )}

        {/* User Menu */}
        <div className="relative ml-2">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setUserMenuOpen(false)}
              ></div>
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {user?.role?.replace('ROLE_', '')}
                  </span>
                </div>
                <a
                  href="/settings"
                  className="block px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Account & Settings
                </a>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
