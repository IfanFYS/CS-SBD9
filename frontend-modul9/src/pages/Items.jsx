import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Items() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [storeId, setStoreId] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  // Fetch items and stores
  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch items
      const itemsResponse = await axios.get(`${backendUrl}/item`);
      console.log('Items response:', itemsResponse.data);
      
      if (itemsResponse.data && itemsResponse.data.success) {
        setItems(itemsResponse.data.payload || []);
        setFilteredItems(itemsResponse.data.payload || []);
        
        // Animate items after loading
        setTimeout(() => {
          setAnimateItems(true);
        }, 100);
      } else {
        setError(itemsResponse.data.message || 'Failed to fetch items.');
        setItems([]);
        setFilteredItems([]);
      }

      // Fetch stores for the dropdown
      const storesResponse = await axios.get(`${backendUrl}/store`);
      console.log('Stores response:', storesResponse.data);
      
      if (storesResponse.data && storesResponse.data.success) {
        setStores(storesResponse.data.payload || []);
      } else {
        // Don't overwrite item error if store fetch fails, but log it
        console.error(storesResponse.data.message || 'Failed to fetch stores.');
        setStores([]);
      }
    } catch (err) {
      console.error('Fetch data error:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching data.');
      setItems([]);
      setStores([]);
      setFilteredItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Add items theme background
    document.body.classList.add('bg-items-theme');
    
    return () => {
      document.body.classList.remove('bg-items-theme');
    };
  }, []);

  // Filter items when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const results = items.filter(item => 
      item.name.toLowerCase().includes(lowercasedSearch) || 
      String(item.price).includes(lowercasedSearch) ||
      (item.store_name && item.store_name.toLowerCase().includes(lowercasedSearch)) ||
      (item.store_location && item.store_location.toLowerCase().includes(lowercasedSearch))
    );
    
    setFilteredItems(results);
  }, [searchTerm, items]);

  // Handle add item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    if (!storeId) {
        setError('Please select a store.');
        setIsSubmitting(false);
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('store_id', storeId);
    if (image) {
      formData.append('image', image);
    }

    try {
      // Add form animation during submission
      e.target.classList.add('animate-pulse');
      
      console.log('Submitting item data:', {
        name,
        price,
        stock,
        store_id: storeId,
        image: image ? 'File attached' : 'No file'
      });
      
      const response = await axios.post(`${backendUrl}/item`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        setMessage('Item added successfully!');
        // Reset form
        setName('');
        setPrice('');
        setStock('');
        setStoreId('');
        setImage(null);
        if (document.getElementById('item-image')) {
          document.getElementById('item-image').value = null; // Reset file input
        }
        fetchData(); // Refresh the list
        setIsAdding(false); // Hide form
      } else {
        setError(response.data.message || 'Failed to add item.');
      }
    } catch (err) {
      console.error('Add item error:', err);
      setError(err.response?.data?.message || 'An error occurred while adding the item.');
    } finally {
      setIsSubmitting(false);
      e.target.classList.remove('animate-pulse');
    }
  };
  
  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 transition-all duration-300 pb-10">
      {/* Improved Header Section with better spacing and organization */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-6 mb-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Product Items
            </h1>
            <p className="mt-2 text-blue-100 font-light">
              Manage your product inventory
            </p>
          </div>
          
          {!isAdding && (
            <button
              onClick={() => { setIsAdding(true); setMessage(''); setError(''); }}
              className="inline-flex items-center px-5 py-2.5 bg-white text-blue-700 rounded-md hover:bg-blue-50 shadow-sm transition-all duration-300 hover:scale-105 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Item
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-fade-in shadow-md" role="alert">
            <div className="flex">
              <div className="py-1">
                <svg className="w-6 h-6 mr-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}
        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 animate-fade-in shadow-md" role="alert">
            <div className="flex">
              <div className="py-1">
                <svg className="w-6 h-6 mr-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="block sm:inline">{message}</span>
            </div>
          </div>
        )}

        {/* Add Item Form */} 
        {isAdding && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border-b-4 border-blue-500 transition-all transform duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add a New Product Item
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="group">
                <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                  Item Name
                </label>
                <input
                  id="item-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300 hover:shadow-md"
                  placeholder="Enter item name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label htmlFor="item-price" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                    Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <input
                      id="item-price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="appearance-none rounded-md relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="item-stock" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                    Stock
                  </label>
                  <input
                    id="item-stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    min="0"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300 hover:shadow-md"
                    placeholder="Available quantity"
                  />
                </div>
              </div>
              <div className="group">
                <label htmlFor="item-store" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                  Store Location
                </label>
                <select
                  id="item-store"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white transition-all duration-300 hover:shadow-md"
                >
                  <option value="" disabled>Select a store</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>{store.name} ({store.address})</option>
                  ))}
                </select>
              </div>
              <div className="group">
                <label htmlFor="item-image" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                  Product Image (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="item-image" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input 
                          id="item-image" 
                          name="item-image" 
                          type="file" 
                          className="sr-only" 
                          onChange={(e) => setImage(e.target.files[0])}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    {image && (
                      <p className="text-sm text-blue-600 font-medium">
                        Selected: {image.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex-1 justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-blue-300 group-hover:text-blue-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  {isSubmitting ? 'Adding...' : 'Add Item'}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setIsAdding(false);
                    setName(''); 
                    setPrice(''); 
                    setStock(''); 
                    setStoreId(''); 
                    setImage(null);
                    if(document.getElementById('item-image')) document.getElementById('item-image').value = null;
                    setError('');
                  }}
                  className="group relative flex-1 justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        {!isAdding && !isLoading && items.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search items by name, price, or store"
                className="pl-10 pr-4 py-3 w-full rounded-lg border-gray-200 border focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 bg-white shadow-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Items List */} 
        {isLoading ? (
          <div className="flex flex-col justify-center items-center mt-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-blue-600 mt-4 font-medium">Loading items...</p>
          </div>
        ) : filteredItems && filteredItems.length > 0 ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${animateItems ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {item.image_url && (
                  <div className="relative h-48 overflow-hidden bg-gray-200 group">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs">
                      <span className="font-medium">ID: {item.id}</span>
                    </div>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-white to-blue-50">
                  <h3 className="text-lg font-semibold text-blue-800 mb-1 line-clamp-1">{item.name}</h3>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-gray-700 font-medium">Rp{Number(item.price).toLocaleString('id-ID')}</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${item.stock > 10 ? 'bg-green-100 text-green-800' : item.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      Stock: {item.stock}
                    </span>
                  </div>
                  <div className="mt-auto pt-3 border-t border-gray-200 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {item.store_name || 'N/A'} <span className="text-gray-400">•</span> {item.store_location || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="text-center my-10 p-8 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-gray-500 mb-3">No items match your search.</p>
            <p className="text-gray-400">Try different keywords or clear the search.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors duration-300"
            >
              Clear Search
            </button>
          </div>
        ) : (
          !error && (
            <div className="text-center my-16 p-8 bg-white rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-lg text-gray-500 mb-6">No items found.</p>
              <p className="text-blue-600 mb-6">Get started by adding your first product!</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Add First Item
              </button>
            </div>
          )
        )}
      </div>
      
      {/* Add some items theme styles */}
      <style jsx="true">{`
        .bg-items-theme {
          background-color: #f0f7ff;
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23bbd6ff' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      `}</style>
    </div>
  );
}

export default Items;
