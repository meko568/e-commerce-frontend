import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotificationPopupProps {
  type: 'success' | 'error';
  message: string;
  duration?: number;
  isVisible?: boolean;
  onClose?: () => void;
}

export function NotificationPopup({ 
  type, 
  message, 
  duration = 3000, 
  onClose 
}: NotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const bgColor = type === 'success' 
    ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
    : 'bg-gradient-to-r from-red-500 to-pink-600';

  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div
        className={`
          relative max-w-md w-full bg-white rounded-2xl shadow-2xl p-6
          transform transition-all duration-300 ease-out
          ${isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
          }
        `}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex items-center space-x-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Message */}
          <div className="flex-1">
            <h3 className="text-lg">
              {type === 'success' ? 'Success!' : 'Error!'}
            </h3>
            <p className="text-sm mt-1">
              {message}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700"
          >
            {type === 'success' ? 'Got it' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
}