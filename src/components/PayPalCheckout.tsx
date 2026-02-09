import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface PayPalCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount?: number;
}

export function PayPalCheckout({ isOpen, onClose, onSuccess, amount }: PayPalCheckoutProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const totalAmount = amount || 0;

  useEffect(() => {
    if (isOpen && paypalRef.current && window.paypal) {
      // Clear any existing PayPal buttons
      paypalRef.current.innerHTML = '';
      
      // Render PayPal buttons
      window.paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalAmount.toFixed(2),
                currency_code: 'USD'
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details: any) {
            toast.success('Payment successful! Order placed.');
            onSuccess();
            onClose();
          });
        },
        onError: function(err) {
          console.error('PayPal error:', err);
          toast.error('Payment failed. Please try again.');
        },
        onCancel: function() {
          toast.info('Payment cancelled.');
        }
      }).render(paypalRef.current);
    }
  }, [isOpen, totalAmount, onSuccess, onClose]);

  // PayPal SDK disabled for development
  // const loadPayPalSDK = () => {
  //   const script = document.createElement('script');
  //   script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=USD';
  //   script.addEventListener('load', () => {
  //     console.log('PayPal SDK loaded');
  //   });
  //   script.addEventListener('error', () => {
  //     console.error('PayPal SDK failed to load');
  //   });
  //   document.body.appendChild(script);
  //   return () => {
  //     if (document.body.contains(script)) {
  //       document.body.removeChild(script);
  //     }
  //   };
  // };

  // useEffect(() => {
  //   if (isOpen) {
  //     loadPayPalSDK();
  //   }
  // }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚧</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Payment Disabled in Development</h3>
            <p className="text-gray-400 mb-6">
              PayPal integration is disabled during development. Orders will be created without payment processing.
            </p>
            <button
              onClick={() => {
                toast.success('Order placed successfully (development mode)');
                onSuccess();
              }}
              className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Place Order (Dev Mode)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add TypeScript declarations for PayPal
declare global {
  interface Window {
    paypal: {
      Buttons: (options: {
        createOrder: (data: any, actions: any) => Promise<string>;
        onApprove: (data: any, actions: any) => Promise<void>;
        onError: (err: any) => void;
        onCancel: () => void;
      }) => {
        render: (container: HTMLElement) => void;
      };
    };
  }
}
