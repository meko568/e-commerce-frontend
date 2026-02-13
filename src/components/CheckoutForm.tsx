import React, { useState } from 'react';
import { User, MapPin, CreditCard, ArrowRight, User as UserIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { PayPalCheckout } from './PayPalCheckout';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export function CheckoutForm({ isOpen, onClose, onSuccess }: CheckoutFormProps) {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  // Auto-fill user data if authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      setUserInfo({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postal_code || '',
        country: user.country || ''
      });
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    // Don't auto-format phone, let user type freely
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(field => !userInfo[field as keyof UserInfo]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (!userInfo.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order data
      const orderData = {
        user_info: userInfo,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.current_price,
          quantity: item.quantity,
          total: (parseFloat(item.current_price) * item.quantity).toFixed(2)
        })),
        total_amount: getCartTotal().toFixed(2),
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString()
      };

      // Store order data for PayPal
      setOrderData(orderData);

      // Show PayPal checkout instead of direct submission
      setShowPayPal(true);
      
    } catch (error) {
      console.error('Order preparation error:', error);
      toast.error('Failed to prepare order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayPalSuccess = async () => {
    if (!orderData) return;

    setIsSubmitting(true);

    try {
      // Send order to backend with paid status
      const response = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...orderData,
          payment_status: 'paid'
        })
      });

      if (response.ok) {
        toast.success('Order placed successfully!');
        clearCart();
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartTotal = getCartTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">Order Summary</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-white">
                    ${(parseFloat(item.current_price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-700">
                <div className="flex justify-between font-semibold text-white">
                  <span>Total</span>
                  <span className="text-cyan-400">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Data Button */}
          {isAuthenticated && user && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-white font-medium">Use your profile information</p>
                    <p className="text-gray-400 text-sm">
                      {user.name} • {user.email}
                      {(user.phone || user.address) && ' • Profile data available'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // Debug: Check user data
                    console.log('User data:', user);
                    console.log('Is authenticated:', isAuthenticated);
                    console.log('User phone:', user.phone);
                    console.log('User address:', user.address);
                    console.log('User city:', user.city);
                    console.log('User postal_code:', user.postal_code);
                    console.log('User country:', user.country);
                    
                    // Auto-fill with user data and format phone number
                    const formatPhone = (phone: string) => {
                      const digits = phone.replace(/\D/g, '');
                      if (digits.length === 0) return '';
                      
                      const mobilePart = digits.substring(0, 10);
                      if (mobilePart.length >= 10) {
                        // Format: +20 11 12345678 (prefix + 8 digits)
                        return `+20 ${mobilePart.substring(0, 2)} ${mobilePart.substring(2, 10)}`;
                      } else if (mobilePart.length >= 3) {
                        // Partial format: +20 11 1234...
                        return `+20 ${mobilePart.substring(0, 2)} ${mobilePart.substring(2)}`;
                      } else if (mobilePart.length >= 2) {
                        // Prefix only: +20 11
                        return `+20 ${mobilePart.substring(0, 2)}`;
                      } else {
                        // Just starting: +20 1
                        return `+20 ${mobilePart}`;
                      }
                    };
                    
                    const newUserInfo = {
                      fullName: user.name || '',
                      email: user.email || '',
                      phone: formatPhone(user.phone || ''),
                      address: user.address || '',
                      city: user.city || '',
                      postalCode: user.postal_code || '',
                      country: user.country || ''
                    };
                    
                    console.log('Setting user info:', newUserInfo);
                    setUserInfo(newUserInfo);
                    
                    // Force a re-render by setting the state again after a small delay
                    setTimeout(() => {
                      console.log('Force updating userInfo...');
                      setUserInfo(prev => ({...prev}));
                    }, 100);
                    
                    toast.success('Profile information loaded!');
                  }}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  Use Profile Data
                </button>
              </div>
            </div>
          )}

          {/* User Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={userInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={userInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onKeyDown={(e) => {
                  // Allow: numbers, plus, space, backspace, delete, tab, enter, escape, arrow keys
                  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '+', ' '];
                  if (!/[0-9+ ]/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="+20 11 12345678"
                required
              />
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Shipping Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                value={userInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={userInfo.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={userInfo.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={userInfo.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Order...
                </>
              ) : (
                <>
                  Continue to PayPal
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* PayPal Checkout Modal */}
      <PayPalCheckout 
        isOpen={showPayPal}
        onClose={() => setShowPayPal(false)}
        onSuccess={handlePayPalSuccess}
        amount={getCartTotal()}
      />
    </div>
  );
}
