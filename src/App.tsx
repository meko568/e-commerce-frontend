import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FuturisticNavbar } from './components/FuturisticNavbar';
import { HeroSection } from './components/HeroSection';
import { MinimalProductCard } from './components/MinimalProductCard';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProductPage } from './pages/ProductPage';
import { Cart } from './components/Cart';
import { PayPalCheckout } from './components/PayPalCheckout';
import { Toaster, toast } from 'sonner';
import { ArrowRight, Github, Twitter, Instagram, Globe, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import './styles/light.css';

function AppContent() {
  const { scrollYProgress } = useScroll();
  const { isAdmin } = useAuth();
  const { currentPage, navigate } = useNavigation();
  const { isRTL, language } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPayPalOpen, setIsPayPalOpen] = useState(false);
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Redirect regular users away from admin page
  useEffect(() => {
    if (currentPage === 'admin' && !isAdmin) {
      navigate('home');
    }
  }, [isAdmin, currentPage, navigate]);

  // Fetch products for home page
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/products');
        const data = await response.json();
        
        if (response.ok) {
          setProducts(data.data || []);
        }
      } catch (error) {
        console.error('AppContent - Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    if (currentPage === 'home') {
      fetchProducts();
    }
  }, [currentPage]);

  if (currentPage === 'product') {
    return (
      <div>
        <Toaster position="top-center" theme="dark" />
        <ProductPage />
      </div>
    );
  }

  if (currentPage === 'admin') {
    return (
      <div>
        <Toaster position="top-center" theme="dark" />
        <AdminDashboard />
      </div>
    );
  }

  if (currentPage === 'login') {
    return (
      <div>
        <Toaster position="top-center" theme="dark" />
        <LoginPage onNavigateToSignup={() => navigate('signup')} />
      </div>
    );
  }

  if (currentPage === 'signup') {
    return (
      <div>
        <Toaster position="top-center" theme="dark" />
        <SignupPage onNavigateToLogin={() => navigate('login')} />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-cyan-500 selection:text-black font-sans">
      <Toaster position="top-center" theme="dark" />
      <FuturisticNavbar 
        onLoginClick={() => navigate('login')} 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 origin-left z-[101]"
        style={{ scaleX }}
      />

      <main>
        <HeroSection />

        {/* Specs Grid */}
        <section className="py-24 relative overflow-hidden bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 ${isRTL ? 'text-right' : ''}`}>
              {[
                {
                  icon: Cpu,
                  title: language === 'ar' ? "المعالجة الكمي" : "Quantum Processing",
                  desc: language === 'ar' 
                    ? "مدعوم بمعالج L-Core بـ 14nm، يقدم أداءً عصبيًا لا مثيل له."
                    : "Powered by the 14nm L-Core, delivering unmatched neural throughput."
                },
                {
                  icon: ShieldCheck,
                  title: language === 'ar' ? "الأمان العصبي" : "Neural Security",
                  desc: language === 'ar'
                    ? "تشفير عسكري مع بروتوكولات مصادقة قياس حيوي."
                    : "Military-grade encryption with biometric authentication protocols."
                },
                {
                  icon: Zap,
                  title: language === 'ar' ? "استجابة فورية" : "Instant Response",
                  desc: language === 'ar'
                    ? "زمن استجابة أقل من مللي ثانية مع خوارزميات تكيفية تنبؤية."
                    : "Sub-millisecond latency with adaptive predictive algorithms."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`text-center ${isRTL ? 'text-right' : ''}`}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}
            >
              <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter mb-6">
                {language === 'ar' ? 'الواجهة العصبية' : 'Neural Interface'}
                <span className="block text-2xl md:text-3xl font-light text-cyan-400 mt-2">
                  {language === 'ar' ? 'منتجات الجيل التالي' : 'Next Generation Products'}
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {language === 'ar' 
                  ? 'استمتع بمستقبل تفاعل الإنسان والحاسوب مع منتجات التكنولوجيا العصبية المتطورة.'
                  : 'Experience the future of human-computer interaction with our cutting-edge neural technology products.'
                }
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productsLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
                    <div className="w-full h-48 bg-gray-800 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <MinimalProductCard 
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.current_price}
                    image={product.main_image}
                    category={language === 'ar' ? 'المنتجات' : 'Products'}
                    rating={4.5}
                    glowColor="#3b82f6"
                    productData={product}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">
                    {language === 'ar' ? 'لا توجد منتجات متاحة حالياً.' : 'No products available yet.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={isRTL ? 'text-right' : ''}
            >
              <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter mb-6">
                {language === 'ar' ? 'هل أنت مستعد لترقية' : 'Ready to Upgrade'}
                <span className="block text-2xl md:text-3xl font-light text-cyan-400 mt-2">
                  {language === 'ar' ? 'وعيك؟' : 'Your Consciousness?'}
                </span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                {language === 'ar' 
                  ? 'انضم إلى آلاف المتبنين الأوائل الذين يستمتعون بالفعل بمستقبل التكنولوجيا العصبية.'
                  : 'Join thousands of early adopters who are already experiencing the future of neural technology.'
                }
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {language === 'ar' ? 'ابدأ التجربة المجانية' : 'Start Free Trial'}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-gray-600 text-white font-semibold rounded-xl hover:border-gray-500 transition-all duration-200"
                >
                  {language === 'ar' ? 'شاهد العرض' : 'Watch Demo'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className={`flex flex-col md:flex-row justify-between items-center ${isRTL ? 'md:flex-row-reverse' : ''}`}>
              <div className={`mb-4 md:mb-0 ${isRTL ? 'text-right' : ''}`}>
                <h3 className="text-2xl font-bold text-white mb-2">NeuralTech</h3>
                <p className="text-gray-400">
                  {language === 'ar' ? 'المستقبل عصبي' : 'The Future is Neural'}
                </p>
              </div>
              <div className={`flex gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Globe className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2024 NeuralTech. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
      
      {/* Cart Components */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <PayPalCheckout 
        isOpen={isPayPalOpen} 
        onClose={() => setIsPayPalOpen(false)}
        onSuccess={() => {
          toast.success('Order placed successfully!');
          setIsPayPalOpen(false);
        }}
      />
    </div>
  );
}

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationProvider>
            <div className="min-h-screen bg-black text-white transition-colors duration-300">
              <AppContent />
            </div>
          </NavigationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
