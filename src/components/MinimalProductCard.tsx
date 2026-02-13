import { motion } from 'framer-motion';
import { Heart, Plus, Zap, Star } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';

interface MinimalProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  rating: number;
  glowColor: string;
  productData?: any;
}

export function MinimalProductCard({ id, name, price, image, category, rating, glowColor, productData }: MinimalProductCardProps) {
  const { addToCart } = useCart();
  const { navigate } = useNavigation();
  const { isRTL, language } = useTheme();

  const handleProductClick = () => {
    // Navigate to product details page
    navigate('product', id.toString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative flex flex-col h-full ${isRTL ? 'text-right' : ''}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-900 border border-white/5 transition-all duration-500 group-hover:border-white/20 cursor-pointer"
           onClick={handleProductClick}>
        {/* Hover Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColor}15 0%, transparent 70%)`
          }}
        />
        
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
        />

        {/* Quick Action Badges */}
        <div className={`absolute top-5 ${isRTL ? 'right-5' : 'left-5'} flex flex-col gap-2`}>
          <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
            {category}
          </span>
        </div>

        {/* Action Buttons Overlay */}
        <div className={`absolute bottom-6 ${isRTL ? 'left-6' : 'right-6'} flex flex-col gap-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500`}>
          <button className="p-4 bg-white text-black rounded-2xl shadow-2xl hover:bg-cyan-500 transition-colors">
            <Heart size={20} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(productData, 1);
            }}
            className="p-4 bg-cyan-500 text-black rounded-2xl shadow-2xl hover:bg-white transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 space-y-2">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {name}
          </h3>
          <span className="text-sm font-black text-cyan-500">{price}</span>
        </div>
        
        <div className={`flex items-center gap-4 text-xs font-bold uppercase tracking-tighter text-white/30 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-white/60">{rating}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Zap size={12} className="text-cyan-500" />
            <span>{language === 'ar' ? 'متوفر' : 'InStock'}</span>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Border Animation */}
      <div className="mt-4 h-[1px] w-full bg-white/5 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cyan-500"
          initial={{ x: '-100%' }}
          whileHover={{ x: '0%' }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}
