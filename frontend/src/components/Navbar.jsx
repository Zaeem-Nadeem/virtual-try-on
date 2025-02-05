import React from 'react';
import { Link } from 'react-router-dom';
import { Glasses, ShoppingCart, Heart, User, Search } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Glasses className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">FitViz</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for eyewear..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/wishlist" className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
              <div className="relative">
                <Heart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </div>
              <span className="text-xs mt-1">Wishlist</span>
            </Link>
            
            <Link to="/cart" className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </div>
              <span className="text-xs mt-1">Cart</span>
            </Link>
            
            <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;