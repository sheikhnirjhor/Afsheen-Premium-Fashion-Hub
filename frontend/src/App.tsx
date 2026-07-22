import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-800">Afsheen Premium Fashion Hub</h1>
      <p className="text-sm text-amber-700 mb-6">Atelier Collection</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product: any) => (
          <div key={product.id} className="border p-4 rounded bg-white shadow-sm">
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-600">Category: {product.category}</p>
            <p className="text-amber-900 font-bold mt-2">৳ {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
