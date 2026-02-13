import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CheckoutForm } from './CheckoutForm';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';

export function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const { isRTL, language } = useTheme();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error(language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty');
      return;
    }
    
    setShowCheckoutForm(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckoutForm(false);
    setIsCheckingOut(false);
    onClose();
  };

  const cartTotal = getCartTotal();
  const itemCount = getCartItemsCount();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cart-sidebar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed ${isRTL ? 'left-0' : 'right-0'} top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-800 z-50 flex flex-col`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b border-gray-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <ShoppingBag className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">
                  {language === 'ar' ? `سلة التسوق (${itemCount})` : `Shopping Cart (${itemCount})`}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className={`text-center py-12 ${isRTL ? 'text-right' : ''}`}>
                  <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-4">
                    {language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <motion.div
                      key={`cart-item-${item.id || index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-800 rounded-lg p-4 space-y-3"
                    >
                      <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {/* Product Image */}
                        <img
                          src={item.main_image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Product';
                          }}
                        />
                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{item.name}</h3>
                          <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-cyan-400 font-semibold">
                              ${parseFloat(item.current_price).toFixed(2)}
                            </span>
                            {item.has_sale && (
                              <span className="text-gray-500 line-through text-sm">
                                ${parseFloat(item.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1">
                            {language === 'ar' ? `المخزون: ${item.stock}` : `Stock: ${item.stock}`}
                          </p>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-400 text-sm">
                            {language === 'ar' ? 'الكمية:' : 'Quantity:'}
                          </span>
                          <div className={`flex items-center border border-gray-700 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-gray-300 hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 text-white min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-300 hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        <div className={isRTL ? 'text-left' : 'text-right'}>
                          <p className="text-white font-semibold">
                            ${(parseFloat(item.current_price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-800 p-6 space-y-4">
                {/* Clear Cart */}
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={clearCart}
                    className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                  >
                    {language === 'ar' ? 'مسح السلة' : 'Clear Cart'}
                  </button>
                  <div className={isRTL ? 'text-left' : 'text-right'}>
                    <p className="text-gray-400 text-sm">
                      {language === 'ar' ? 'الإجمالي' : 'Total'}
                    </p>
                    <p className="text-2xl font-bold text-cyan-400">
                      ${cartTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      {language === 'ar' ? 'الدفعال' : 'Checkout'}
                      <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      
      {/* Checkout Form Modal */}
      <CheckoutForm 
        isOpen={showCheckoutForm}
        onClose={() => setShowCheckoutForm(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </AnimatePresence>
  );
}
