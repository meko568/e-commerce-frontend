import { ArrowRight } from 'lucide-react';
import { motion } from "framer-motion"
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
              New Collection 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Style that <br />
              <span className="text-indigo-600">Speaks Volume</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg">
              Discover our latest collection of premium fashion essentials designed for the modern lifestyle. Quality materials meet timeless design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center group">
                Shop Collection
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button className="px-8 py-4 bg-white text-gray-900 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                View Lookbook
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold text-gray-900">50k+</p>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12k+</p>
                <p className="text-sm text-gray-500">Premium Products</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1765009433753-c7462637d21f"
                alt="Modern Fashion"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Element */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Available Now</p>
                  <p className="text-lg font-bold text-gray-900">Summer Drop '26</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
