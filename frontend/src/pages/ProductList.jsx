import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Glasses, Heart, Star } from 'lucide-react';

const randomProducts = [
  {
    id: 1,
    name: "Ray-Ban Aviator Classic",
    brand: "Ray-Ban",
    price: 199.99,
    rating: 4.8,
    reviews: 128,
    product_images: [{ url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1600&auto=format&fit=crop" }],
    isNew: true,
    discount: 0,
  },
  {
    id: 2,
    name: "Oakley Holbrook",
    brand: "Oakley",
    price: 159.99,
    rating: 4.6,
    reviews: 89,
    product_images: [{ url: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1600&auto=format&fit=crop" }],
    isNew: false,
    discount: 15,
  },
  {
    id: 3,
    name: "Gucci Square Frame",
    brand: "Gucci",
    price: 349.99,
    rating: 4.9,
    reviews: 56,
    product_images: [{ url: "https://images.unsplash.com/photo-1614715838608-dd527c46231d?q=80&w=1600&auto=format&fit=crop" }],
    isNew: true,
    discount: 0,
  },
  {
    id: 4,
    name: "Persol Round Classic",
    brand: "Persol",
    price: 249.99,
    rating: 4.7,
    reviews: 92,
    product_images: [{ url: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=1600&auto=format&fit=crop" }],
    isNew: false,
    discount: 20,
  },
  {
    id: 5,
    name: "Prada Linea Rossa",
    brand: "Prada",
    price: 379.99,
    rating: 4.8,
    reviews: 45,
    product_images: [{ url: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=1600&auto=format&fit=crop" }],
    isNew: true,
    discount: 0,
  },
  {
    id: 6,
    name: "Tom Ford Morgan",
    brand: "Tom Ford",
    price: 429.99,
    rating: 4.9,
    reviews: 34,
    product_images: [{ url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1600&auto=format&fit=crop" }],
    isNew: false,
    discount: 10,
  },
];

function ProductList() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-80 rounded-2xl overflow-hidden mb-12">
        <img
          src="https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=2070&auto=format&fit=crop"
          alt="Eyewear Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="text-white p-8 max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Premium Eyewear Collection</h1>
            <p className="text-lg mb-6">Discover our latest collection of designer frames and sunglasses.</p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {randomProducts.map((product) => (
          <div key={product.id} className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              {/* Product Image */}
              <img
                src={product.product_images[0]?.url}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    New
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
                <Link
                  to={`/try-on/${product.id}`}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Glasses className="h-5 w-5 text-indigo-600" />
                </Link>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <Link to={`/product/${product.id}`} className="block group-hover:text-indigo-600 transition-colors">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                
                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    {product.discount > 0 ? (
                      <>
                        <span className="text-lg font-bold text-red-600">
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;