import React, { useState } from 'react';
import { ShoppingCart, Search, User, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              LUMINA
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Shop</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">New Arrivals</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Brands</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Deals</a>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-5">
            <button className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Search size={20} />
            </button>
            <button className="text-gray-600 hover:text-indigo-600 transition-colors">
              <User size={20} />
            </button>
            <button className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Heart size={20} />
            </button>
            <button className="relative text-gray-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-indigo-600 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <a href="#" className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Shop</a>
              <a href="#" className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">New Arrivals</a>
              <a href="#" className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Brands</a>
              <a href="#" className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Deals</a>
              <div className="flex items-center space-x-6 px-3 py-4 mt-2 border-t border-gray-100">
                <Search size={20} className="text-gray-600" />
                <User size={20} className="text-gray-600" />
                <ShoppingCart size={20} className="text-gray-600" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
