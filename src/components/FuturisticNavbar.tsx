import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, Settings, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { ProfilePage } from './ProfilePage';

interface FuturisticNavbarProps {
  onLoginClick?: () => void;
  isCartOpen?: boolean;
  setIsCartOpen?: (open: boolean) => void;
}

export function FuturisticNavbar({ onLoginClick, setIsCartOpen }: FuturisticNavbarProps) {
  const { navigate } = useNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const { getCartItemsCount } = useCart();
  const { isRTL, t, theme, language } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[100] border-b transition-all duration-300 ${
          isScrolled 
            ? theme === 'light' 
              ? 'bg-white/90 backdrop-blur-lg border-gray-200 shadow-sm'
              : 'bg-gray-900/80 backdrop-blur-lg border-white/5'
            : 'bg-transparent border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-500 rounded-lg flex items-center justify-center relative overflow-hidden">
              <Zap className="text-black z-10" size={20} />
              <motion.div 
                animate={{ 
                  left: ['-100%', '200%'],
                  top: ['-100%', '200%']
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute w-16 h-2 bg-white/40 rotate-45"
              />
            </div>
            <span className={`text-lg sm:text-2xl font-black tracking-taller transition-colors ${
              theme === 'light' 
                ? 'text-gray-900 group-hover:text-cyan-600' 
                : 'text-white group-hover:text-cyan-400'
            }`}>
              NEO<span className={theme === 'light' ? 'text-cyan-600' : 'text-cyan-500'}>TECH</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center gap-6 xl:gap-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {['quantum', 'neural', 'cyber', 'specs'].map((item) => (
            <a 
              key={item} 
              href={`#${item}`}
              className={`text-xs sm:text-sm font-bold uppercase tracking-widest transition-all relative group ${
                theme === 'light'
                  ? 'text-gray-600 hover:text-cyan-600'
                  : 'text-white/60 hover:text-cyan-400'
              }`}
            >
              {t(item)}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden transition-colors p-2 rounded-lg ${
            theme === 'light'
              ? 'text-gray-600 hover:text-cyan-600 hover:bg-gray-100'
              : 'text-white/60 hover:text-cyan-400 hover:bg-white/10'
          }`}
        >
          <Menu size={24} />
        </button>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <button className={`transition-colors p-2 rounded-lg ${
            theme === 'light'
              ? 'text-gray-600 hover:text-cyan-600 hover:bg-gray-100'
              : 'text-white/60 hover:text-cyan-400 hover:bg-white/10'
          }`}>
            <Search size={18} />
          </button>
          <button 
            onClick={() => setIsCartOpen?.(true)}
            className={`relative transition-colors p-2 rounded-lg ${
              theme === 'light'
                ? 'text-gray-600 hover:text-cyan-600 hover:bg-gray-100'
                : 'text-white/60 hover:text-cyan-400 hover:bg-white/10'
            }`}
          >
            <ShoppingCart size={18} />
            <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-cyan-500 text-[10px] sm:text-[11px] text-black font-black flex items-center justify-center rounded-full">
              {getCartItemsCount()}
            </span>
          </button>
          
          {isAuthenticated ? (
            // User Profile Section
            <div className="flex items-center gap-4">
              {isAdmin && (
                <button
                  onClick={() => navigate('admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-purple-700 to-purple-800 shadow-xl hover:shadow-purple-600/50 border border-purple-600'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  <Settings className={`w-4 h-4 ${theme === 'light' ? 'text-white' : 'text-white'}`} />
                  <span className={`${theme === 'light' ? 'text-white font-medium' : 'text-white font-medium'}`}>
                    {language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
                  </span>
                </button>
              )}
              <button
                onClick={() => setShowProfile(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-blue-700 to-blue-800 shadow-xl hover:shadow-blue-600/50 border border-blue-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <User className={`w-4 h-4 ${theme === 'light' ? 'text-white' : 'text-white'}`} />
                <span className={`${theme === 'light' ? 'text-white font-medium' : 'text-white font-medium'}`}>
                  {t('profile')}
                </span>
              </button>
              <button className={`lg:hidden transition-colors ${
                theme === 'light' ? 'text-gray-600' : 'text-white'
              }`}>
                <Menu size={24} />
              </button>
            </div>
          ) : (
            // Login Button
            <>
              <button 
                onClick={onLoginClick}
                className={`hidden sm:block px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  theme === 'light'
                    ? 'bg-gray-100 border border-gray-300 text-gray-900 hover:bg-gray-200'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {t('login')}
              </button>
              <button className={`lg:hidden transition-colors ${
                theme === 'light' ? 'text-gray-600' : 'text-white'
              }`}>
                <Menu size={24} />
              </button>
            </>
          )}
        </div>
      </div>
      </motion.nav>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-nav">
          <div className={`mobile-nav-content ${isMobileMenuOpen ? 'mobile-menu-enter' : 'mobile-menu-exit'} ${isRTL ? 'right-0 left-auto' : ''}`}>
            <div className="p-6 space-y-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                {['quantum', 'neural', 'cyber', 'specs'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item}`}
                    className={`block text-lg font-bold uppercase tracking-widest transition-colors py-2 ${
                      theme === 'light'
                        ? 'text-gray-600 hover:text-cyan-600'
                        : 'text-white/60 hover:text-cyan-400'
                    }`}
                  >
                    {t(item)}
                  </a>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <ThemeToggle />
                
                <button className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  theme === 'light'
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    : 'bg-white/10 hover:bg-white/20 text-white/60'
                }`}>
                  <span>{t('search')}</span>
                  <Search size={20} />
                </button>

                <button 
                  onClick={() => setIsCartOpen?.(true)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      : 'bg-white/10 hover:bg-white/20 text-white/60'
                  }`}
                >
                  <span>{t('cart')}</span>
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={20} />
                    <span className="w-6 h-6 bg-cyan-500 text-[11px] text-black font-black flex items-center justify-center rounded-full">
                      {getCartItemsCount()}
                    </span>
                  </div>
                </button>

                {isAuthenticated ? (
                  <div className="space-y-3">
                    {isAdmin && (
                      <button
                        onClick={() => navigate('admin')}
                        className={`w-full flex items-center gap-2 p-3 rounded-lg transition-all ${
                          theme === 'light'
                            ? 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                            : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400'
                        }`}
                      >
                        <Settings size={20} />
                        <span>{language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowProfile(true)}
                      className={`w-full flex items-center gap-2 p-3 rounded-lg transition-all ${
                        theme === 'light'
                          ? 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                          : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                        }`}
                    >
                      <User size={20} />
                      <span>{t('profile')}</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={onLoginClick}
                    className={`w-full p-3 rounded-lg text-center font-bold uppercase tracking-widest transition-all ${
                      theme === 'light'
                        ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    }`}
                  >
                    {t('login')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Profile Page Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowProfile(false)}
            />
            <div className="relative w-full max-w-4xl">
              <ProfilePage />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
