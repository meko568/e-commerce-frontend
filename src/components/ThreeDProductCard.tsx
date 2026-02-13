import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArrowUpRight, Zap } from 'lucide-react';

interface ThreeDProductCardProps {
  name: string;
  price: string;
  image: string;
  category: string;
  glowColor: string;
}

export function ThreeDProductCard({ name, price, image, category, glowColor }: ThreeDProductCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative h-[450px] w-full rounded-3xl bg-neutral-900 border border-white/10 group cursor-pointer"
    >
      {/* Background Glow */}
      <div 
        style={{ backgroundColor: glowColor }}
        className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-[100px] transition-opacity duration-500 rounded-3xl"
      />

      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 p-6 flex flex-col"
      >
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 py-1 px-3 bg-cyan-500/10 rounded-full border border-cyan-500/20">
            {category}
          </span>
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-cyan-500 transition-colors duration-300">
            <ArrowUpRight size={16} className="text-white group-hover:text-black" />
          </div>
        </div>

        <div 
           style={{ transform: "translateZ(50px)" }}
           className="relative flex-1 flex items-center justify-center py-8"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div style={{ transform: "translateZ(30px)" }} className="mt-auto">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white">{price}</span>
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
              <Zap size={12} className="text-cyan-500" />
              Pre-Order
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating UI Elements inside card */}
      <div 
        style={{ transform: "translateZ(100px)" }}
        className="absolute -right-4 top-1/2 -translate-y-1/2 p-3 bg-cyan-500 text-black rounded-xl font-black text-[10px] shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0"
      >
        LIMITED
      </div>
    </motion.div>
  );
}
