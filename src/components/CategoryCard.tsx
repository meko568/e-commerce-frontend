import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface CategoryCardProps {
  title: string;
  count: string;
  image: string;
}

export function CategoryCard({ title, count, image }: CategoryCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
    >
      <ImageWithFallback
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
        <p className="text-white/80 text-sm font-medium mb-1">{count} Products</p>
        <h3 className="text-white text-2xl font-bold">{title}</h3>
      </div>
    </motion.div>
  );
}
