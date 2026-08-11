import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/products/");
      if (!response.ok) {
        throw new Error("Failed to fetch products from backend API");
      }
      const data = await response.json();
      // Data format from backend API is { items: [...], total: ... } or Array
      const itemsList = Array.isArray(data) ? data : data.items || [];
      setProducts(itemsList);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products from backend:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, loading, error, refreshProducts: fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
