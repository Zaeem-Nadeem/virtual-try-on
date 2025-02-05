import React from 'react';
import { Link } from 'react-router-dom';
import { Glasses, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Glasses className="h-8 w-8 text-indigo-500" />
              <span className="text-xl font-bold text-white">EyeWear</span>
            </div>
            <p className="text-sm">
              Discover the perfect blend of style and comfort with our premium eyewear collection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-indigo-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-indigo-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/new-arrivals" className="hover:text-indigo-500 transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link to="/bestsellers" className="hover:text-indigo-500 transition-colors">Bestsellers</Link>
              </li>
              <li>
                <Link to="/men" className="hover:text-indigo-500 transition-colors">Men's Collection</Link>
              </li>
              <li>
                <Link to="/women" className="hover:text-indigo-500 transition-colors">Women's Collection</Link>
              </li>
              <li>
                <Link to="/sale" className="hover:text-indigo-500 transition-colors">Sale</Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-indigo-500 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-indigo-500 transition-colors">Shipping Information</Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-indigo-500 transition-colors">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-indigo-500 transition-colors">Size Guide</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-500 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-indigo-500" />
                <span>123 Fashion Street, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-indigo-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-indigo-500" />
                <span>support@eyewear.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 EyeWear. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm hover:text-indigo-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm hover:text-indigo-500 transition-colors">Terms of Service</Link>
              <Link to="/sitemap" className="text-sm hover:text-indigo-500 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;