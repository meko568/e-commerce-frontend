import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { toast } from 'sonner';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  discount?: number;
}

export function ProductCard({ name, price, image, category, rating, discount }: ProductCardProps) {
  const addToCart = () => {
    toast.success(`${name} added to cart!`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {category}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition-colors">
            <Heart size={18} />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={addToCart}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({rating})</span>
        </div>
        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{name}</h3>
        <div className="flex items-center gap-3">
          <span className="text-lg font-extrabold text-gray-900">${price.toFixed(2)}</span>
          {discount && (
            <span className="text-sm text-gray-400 line-through">
              ${(price / (1 - discount / 100)).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
