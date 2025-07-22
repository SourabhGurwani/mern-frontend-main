import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash, FaArrowLeft, FaArrowRight, FaPlus, FaTimes, FaCheck } from "react-icons/fa";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const frmRef = useRef();
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    imgUrl: "",
  });
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const url = `${API_URL}/api/products/?page=${page}&search=${searchVal}`;
      const result = await axios.get(url);
      setProducts(result.data.products);
      setTotalPages(result.data.totalPages || Math.ceil(result.data.total / 10));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchVal]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/api/products/${id}`);
      setSuccess("Product deleted successfully");
      await fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!frmRef.current.checkValidity()) {
      frmRef.current.reportValidity();
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/api/products`, form);
      setSuccess("Product added successfully");
      resetForm();
      setPage(1); // Show latest product by going to page 1
      await fetchProducts(); // Ensure fresh data is loaded
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      productName: product.productName,
      description: product.description,
      price: product.price,
      imgUrl: product.imgUrl,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!frmRef.current.checkValidity()) {
      frmRef.current.reportValidity();
      return;
    }

    try {
      setIsLoading(true);
      await axios.patch(`${API_URL}/api/products/${editId}`, form);
      setSuccess("Product updated successfully");
      setEditId(null);
      resetForm();
      await fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      productName: "",
      description: "",
      price: "",
      imgUrl: "",
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="products-container">
      <h2 className="products-title">Product Management</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="product-form-container">
        <form ref={frmRef} className="product-form">
          <div className="form-row">
            <div className="input-group">
              <label>Product Name</label>
              <input
                name="productName"
                value={form.productName}
                type="text"
                placeholder="Product Name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Price</label>
              <input
                name="price"
                value={form.price}
                type="number"
                placeholder="Price"
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                placeholder="Description"
                onChange={handleChange}
                required
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Image URL</label>
              <input
                name="imgUrl"
                value={form.imgUrl}
                type="text"
                placeholder="Image URL"
                onChange={handleChange}
              
              />
            </div>

            <div className="form-actions">
              {editId ? (
                <>
                  <button type="button" onClick={handleUpdate} className="btn-update" disabled={isLoading}>
                    <FaCheck /> Update
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-cancel" disabled={isLoading}>
                    <FaTimes /> Cancel
                  </button>
                </>
              ) : (
                <button type="button" onClick={handleAdd} className="btn-add" disabled={isLoading}>
                  <FaPlus /> Add Product
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-group">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search products..."
            />
            <button type="submit" className="btn-search">Search</button>
          </div>
        </form>
      </div>

      <div className="products-table-container">
        {isLoading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products">No products found</div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Price</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.productName}</td>
                  <td className="description-cell">{product.description}</td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>
                    {product.imgUrl && (
                      <img src={product.imgUrl} alt={product.productName} className="product-thumbnail" />
                    )}
                  </td>
                  <td className="actions">
                    <button onClick={() => handleEdit(product)} className="btn-edit">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="btn-delete">
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1 || isLoading}
          className="btn-prev"
        >
          <FaArrowLeft /> Previous
        </button>

        <span className="page-info">Page {page} of {totalPages}</span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages || isLoading || products.length === 0}
          className="btn-next"
        >
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
