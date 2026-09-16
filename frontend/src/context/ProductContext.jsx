import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/product.service';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!isAuthenticated) {
      setProducts([]);
      setSelectedProduct(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);

      const storedId = localStorage.getItem('sprintpilot_selected_product_id');
      const found = data.find(p => p.id === Number(storedId));

      if (found) {
        setSelectedProduct(found);
      } else if (data.length > 0) {
        setSelectedProduct(data[0]);
        localStorage.setItem('sprintpilot_selected_product_id', data[0].id);
      } else {
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isAuthenticated]);

  const selectProduct = (product) => {
    setSelectedProduct(product);
    if (product) {
      localStorage.setItem('sprintpilot_selected_product_id', product.id);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      selectedProduct,
      selectProduct,
      refreshProducts: fetchProducts,
      loading
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
