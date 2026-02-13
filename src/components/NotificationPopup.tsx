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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div
        className={`
          relative w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8
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
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors touch-target"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Content */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 ${bgColor} rounded-full flex items-center justify-center`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {type === 'success' ? 'Success!' : 'Error!'}
            </h3>
            <p className="text-xs sm:text-sm mt-1 text-gray-700 break-words">
              {message}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 sm:mt-6 flex justify-end">
          <button
            onClick={handleClose}
            className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700 button-touch"
          >
            {type === 'success' ? 'Got it' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
}