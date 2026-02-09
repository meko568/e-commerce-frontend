import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { NotificationPopup } from './NotificationPopup';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface LoginFormProps {
  onNavigateToSignup?: () => void;
}

export function LoginForm({ onNavigateToSignup }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const { login } = useAuth();
  const { isRTL, t, language } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    return undefined;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const newErrors: FormErrors = {};
    
    if (field === 'email') {
      newErrors.email = validateEmail(formData.email);
    } else if (field === 'password') {
      newErrors.password = validatePassword(formData.password);
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    
    setErrors(newErrors);
    setTouched({
      email: true,
      password: true
    });
    
    const hasErrors = Object.values(newErrors).some(error => error !== undefined);
    
    if (!hasErrors) {
      try {
        await login(formData.email, formData.password);
        
        // Show success popup
        setNotification({
          type: 'success',
          message: 'Login successful! Welcome back.'
        });
        
        // Redirect to home after successful login
        setTimeout(() => {
          window.history.pushState({}, '', '/');
          window.location.reload();
        }, 2000);
        
      } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to login. Please try again.';
        setNotification({
          type: 'error',
          message: errorMessage
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className={`text-center mb-8 ${isRTL ? 'text-right' : ''}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'مرحبا بعود' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {language === 'ar' ? 'سجل الدخول إلى حسابك للمتابعة' : 'Sign in to your account to continue'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {t('email')}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`block w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 ${
                    touched.email && errors.email
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder={language === 'ar' ? 'example@email.com' : 'john@example.com'}
                />
              </div>
              {touched.email && errors.email && (
                <div className={`mt-2 flex items-center text-red-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {t('password')}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`block w-full ${isRTL ? 'pr-10 pr-10' : 'pl-10 pl-10'} py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 ${
                    touched.password && errors.password
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder={language === 'ar' ? '••••••••' : '•••••••'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <div className={`mt-2 flex items-center text-red-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <label className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className={`text-sm text-gray-600 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                  {language === 'ar' ? 'تذكرني' : 'Remember me'}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-[1.02]"
            >
              {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          </form>

          {/* Toggle to Signup */}
          <div className={`mt-6 text-center ${isRTL ? 'text-right' : ''}`}>
            <p className="text-gray-600">
              {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}
            </p>
            <button
              type="button"
              onClick={onNavigateToSignup}
              className={`${isRTL ? 'mr-1' : 'ml-1'} text-blue-600 hover:text-blue-500 font-medium`}
            >
              {language === 'ar' ? 'إنشاء حساب' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Notification Popup */}
      {notification && (
        <NotificationPopup
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
