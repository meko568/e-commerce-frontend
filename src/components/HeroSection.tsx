import React from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ChevronRight, Play, Cpu, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function HeroSection() {
  const { isRTL, t, language, theme } = useTheme();
  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-20 ${
      theme === 'light' 
        ? 'bg-white' 
        : 'bg-black'
    }`}>
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] animate-pulse ${
          theme === 'light' ? 'bg-cyan-200/30' : 'bg-cyan-900/20'
        }`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] animate-pulse delay-700 ${
          theme === 'light' ? 'bg-purple-200/30' : 'bg-purple-900/20'
        }`} />
        <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none ${
          theme === 'light' ? 'opacity-5' : 'opacity-10'
        }`} />
      </div>

      {/* Grid Pattern */}
      <div className={`absolute inset-0 bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] ${
        theme === 'light'
          ? 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'
          : 'bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]'
      }`} />

      <div className={`max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 ${isRTL ? 'lg:grid-cols-2' : ''}`}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={isRTL ? 'text-right' : ''}
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 ${isRTL ? 'flex-row-reverse' : ''} ${
            theme === 'light'
              ? 'bg-cyan-100 border border-cyan-200'
              : 'bg-cyan-500/10 border border-cyan-500/20'
          }`}>
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              theme === 'light' ? 'text-cyan-700' : 'text-cyan-500'
            }`}>
              {language === 'ar' ? 'Neural Core v2.0 متاحر' : 'Neural Core v2.0 Available'}
            </span>
          </div>
          
          <h1 className={`text-6xl md:text-8xl font-black leading-none tracking-tighter mb-8 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {language === 'ar' ? (
              <>
                أبعد من <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500">
                  الواقع.
                </span>
              </>
            ) : (
              <>
                BEYOND <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500">
                  REALITY.
                </span>
              </>
            )}
          </h1>
          
          <p className={`text-lg mb-12 max-w-lg leading-relaxed font-medium ${
            theme === 'light' ? 'text-gray-600' : 'text-white/50'
          }`}>
            {language === 'ar' 
              ? 'استمتع بالتطور التالي لواجهة الإنسان والحاسوب. أجهزة مرتبطة عصبيًا مصممة لمهندسي المستقبل.'
              : 'Experience the next evolution of human-computer interface. Neural-linked hardware designed for the architects of the future.'
            }
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <button className="group relative px-10 py-5 bg-cyan-500 text-black font-black rounded-2xl overflow-hidden hover:scale-105 transition-all active:scale-95">
              <span className={`relative z-10 flex items-center gap-2 text-sm uppercase tracking-widest ${isRTL ? 'flex-row-reverse' : ''}`}>
                {language === 'ar' ? 'ابدأ الشراء' : 'Initiate Purchase'} 
                <ChevronRight size={18} className={isRTL ? 'rotate-180' : ''} />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
            
            <button className={`flex items-center gap-4 px-8 py-5 font-bold group ${isRTL ? 'flex-row-reverse' : ''} ${
              theme === 'light' ? 'text-gray-700' : 'text-white'
            }`}>
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all ${
                theme === 'light' ? 'border-gray-300' : 'border-white/20'
              }`}>
                <Play size={16} fill="currentColor" />
              </div>
              <span className="text-sm uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                {language === 'ar' ? 'شاهد الفيلم' : 'Watch Film'}
              </span>
            </button>
          </div>

          <div className={`mt-20 grid grid-cols-3 gap-8 border-t pt-10 ${isRTL ? 'text-right' : ''} ${
            theme === 'light' ? 'border-gray-200' : 'border-white/10'
          }`}>
            {[
              { label: language === 'ar' ? 'زمن الاستجابة' : 'Latency', value: '0.01ms', icon: Zap },
              { label: language === 'ar' ? 'الرابط العصبي' : 'Neural Link', value: 'v4.2', icon: Cpu },
              { label: language === 'ar' ? 'البطارية' : 'Battery', value: '480h', icon: Play },
            ].map((stat, i) => (
              <div key={i} className={isRTL ? 'text-right' : ''}>
                <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''} ${
                  theme === 'light' ? 'text-gray-500' : 'text-white/40'
                }`}>
                  <stat.icon size={12} className="text-cyan-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className={`text-2xl font-black ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative perspective-[2000px]"
        >
          {/* Main Hero Product with 3D Float */}
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              rotateY: [0, 10, -10, 0],
              rotateX: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative z-20"
          >
            <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1744591433649-28069739f80b"
              alt="Neural Headphones"
              className="w-full max-w-[600px] mx-auto relative z-10 drop-shadow-[0_50px_100px_rgba(6,182,212,0.3)]"
            />
          </motion.div>

          {/* Floating UI Badges */}
          <motion.div 
            animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className={`absolute top-20 right-0 z-30 p-4 rounded-2xl backdrop-blur-xl border shadow-2xl ${
              theme === 'light'
                ? 'bg-gray-900/80 border-gray-700'
                : 'bg-black/60 border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-black font-black">AI</div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white" style={{ color: '#ffffff !important' }}>
                  {language === 'ar' ? 'النواة النشطة' : 'Active Core'}
                </div>
                <div className="text-white font-bold" style={{ color: '#ffffff !important' }}>SYNERGY AI</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            className={`absolute bottom-20 left-0 z-30 p-4 rounded-2xl backdrop-blur-xl border shadow-2xl ${
              theme === 'light'
                ? 'bg-gray-900/80 border-gray-700'
                : 'bg-black/60 border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center text-black font-black">HIFI</div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white" style={{ color: '#ffffff !important' }}>
                  {language === 'ar' ? 'دقة الصوت' : 'Audio fidelity'}
                </div>
                <div className="text-white font-bold" style={{ color: '#ffffff !important' }}>192KHZ / 32BIT</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
