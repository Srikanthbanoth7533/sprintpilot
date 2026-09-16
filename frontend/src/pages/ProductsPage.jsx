import React, { useState, useEffect } from 'react';
import { productService } from '../services/product.service';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CreateProductModal } from '../components/CreateProductModal';
import { Package, Plus, Calendar, Layers, CheckCircle, Trash2, ArrowRight } from 'lucide-react';

export const ProductsPage = () => {
  const { products, selectedProduct, selectProduct, refreshProducts, loading } = useProduct();
  const { hasRole } = useAuth();
  const toast = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const canCreate = hasRole('ADMIN', 'PRODUCT_MANAGER');
  const canDelete = hasRole('ADMIN');

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this product? All related stories and sprints will be affected.")) return;
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted");
      refreshProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Product Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage product lines, feature roadmaps, and stakeholder deliverables
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Product</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="p-12 saas-card text-center">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No products configured</h3>
          <p className="text-xs text-slate-500 mt-1">Get started by creating your first product roadmap</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => {
            const isSelected = selectedProduct?.id === product.id;

            return (
              <div
                key={product.id}
                onClick={() => selectProduct(product)}
                className={`saas-card saas-card-hover p-6 cursor-pointer border-2 transition-all flex flex-col justify-between ${
                  isSelected ? 'border-indigo-600 bg-indigo-50/10' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        product.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        product.status === 'IN_DISCOVERY' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {product.status}
                      </span>
                      {canDelete && (
                        <button
                          onClick={(e) => handleDelete(product.id, e)}
                          title="Delete Product (Admin)"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-1.5 flex items-center gap-2">
                    {product.name}
                    {isSelected && (
                      <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {product.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Active Sprints</span>
                    <span className="font-bold text-slate-800">{product.activeSprintCount ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Backlog Stories</span>
                    <span className="font-bold text-slate-800">{product.totalStoriesCount ?? 0}</span>
                  </div>
                  {product.targetReleaseDate && (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Target Milestone</span>
                      <span className="font-bold text-indigo-600 text-[11px]">{product.targetReleaseDate}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end text-xs font-bold text-indigo-600 gap-1">
                    <span>{isSelected ? 'Currently Selected' : 'Set as Active'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateProductModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};
