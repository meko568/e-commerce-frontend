import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Phone, MapPin } from 'lucide-react';
import { NotificationPopup } from './NotificationPopup';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

interface SignupFormProps {
  onNavigateToLogin?: () => void;
}

export function SignupForm({ onNavigateToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateFullName = (fullName: string): string | undefined => {
    if (!fullName) return 'Full name is required';
    if (fullName.length < 2) return 'Full name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(fullName)) return 'Full name can only contain letters and spaces';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      // If the check fails, allow the user to proceed (server will validate anyway)
      return false;
    }
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (phone && !/^[\d\s\+\-\(\)]+$/.test(phone)) return 'Please enter a valid phone number';
    if (phone) {
      // Remove all non-digits and spaces for validation
      const cleanPhone = phone.replace(/\D/g, '');
      
      // Check if it's a valid Egyptian number
      if (cleanPhone.length === 12 && cleanPhone.startsWith('20')) {
        const mobilePart = cleanPhone.substring(2);
        const validPrefixes = ['10', '11', '12', '15'];
        const prefix = mobilePart.substring(0, 2);
        const remainingDigits = mobilePart.substring(2);
        
        if (!validPrefixes.includes(prefix)) {
          return 'Invalid Egyptian mobile number prefix (use 10, 11, 12, or 15). Example: +20 11 12345678';
        }
        if (remainingDigits.length !== 8) {
          return 'Egyptian mobile number must have exactly 8 digits after prefix. Example: +20 11 12345678';
        }
      } else if (cleanPhone.length === 10) {
        const validPrefixes = ['10', '11', '12', '15'];
        const prefix = cleanPhone.substring(0, 2);
        const remainingDigits = cleanPhone.substring(2);
        
        if (!validPrefixes.includes(prefix)) {
          return 'Invalid Egyptian mobile number prefix (use 10, 11, 12, or 15). Example: +20 11 12345678';
        }
        if (remainingDigits.length !== 8) {
          return 'Egyptian mobile number must have exactly 8 digits after prefix. Example: +20 11 12345678';
        }
      } else if (cleanPhone.length > 0 && cleanPhone.length !== 10 && cleanPhone.length !== 12) {
        return 'Egyptian phone number must be 10 digits total (2 prefix + 8 digits). Example: +20 11 12345678';
      }
    }
    return undefined;
  };

  const validateAddress = (address: string): string | undefined => {
    if (address && address.length < 5) return 'Address must be at least 5 characters';
    return undefined;
  };

  const validateCity = (city: string): string | undefined => {
    if (city && city.length < 2) return 'City must be at least 2 characters';
    return undefined;
  };

  const validatePostalCode = (postalCode: string): string | undefined => {
    if (postalCode && !/^[\d\s\-\w]+$/.test(postalCode)) return 'Please enter a valid postal code';
    return undefined;
  };

  const validateCountry = (country: string): string | undefined => {
    if (country && country.length < 2) return 'Country must be at least 2 characters';
    return undefined;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Don't auto-format phone, let user type freely
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = async (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const newErrors: FormErrors = {};
    
    if (field === 'fullName') {
      newErrors.fullName = validateFullName(formData.fullName);
    } else if (field === 'email') {
      newErrors.email = validateEmail(formData.email);
      
      // Check if email exists only if it's valid
      if (!newErrors.email && formData.email) {
        try {
          const emailExists = await checkEmailExists(formData.email);
          if (emailExists) {
            newErrors.email = 'This email is already registered';
          }
        } catch (error) {
          // If check fails, let server handle it during submission
        }
      }
    } else if (field === 'password') {
      newErrors.password = validatePassword(formData.password);
      if (formData.confirmPassword) {
        newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
      }
    } else if (field === 'confirmPassword') {
      newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
    } else if (field === 'phone') {
      newErrors.phone = validatePhone(formData.phone);
    } else if (field === 'address') {
      newErrors.address = validateAddress(formData.address);
    } else if (field === 'city') {
      newErrors.city = validateCity(formData.city);
    } else if (field === 'postalCode') {
      newErrors.postalCode = validatePostalCode(formData.postalCode);
    } else if (field === 'country') {
      newErrors.country = validateCountry(formData.country);
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    newErrors.fullName = validateFullName(formData.fullName);
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.address = validateAddress(formData.address);
    newErrors.city = validateCity(formData.city);
    newErrors.postalCode = validatePostalCode(formData.postalCode);
    newErrors.country = validateCountry(formData.country);
    
    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      address: true,
      city: true,
      postalCode: true,
      country: true
    });
    
    const hasErrors = Object.values(newErrors).some(error => error !== undefined);
    
    if (!hasErrors) {
      try {
        // Map fullName to name for backend compatibility
        const apiData = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country
        };
        
        const res = await fetch('http://127.0.0.1:8000/api/signup', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData)
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          
          // Handle specific validation errors
          if (res.status === 422 && errorData.errors) {
            // Extract the first validation error
            const firstError = Object.values(errorData.errors)[0] as string[];
            const errorMessage = firstError?.[0] || errorData.message || 'Validation failed';
            throw new Error(errorMessage);
          }
          
          throw new Error(errorData.message || 'Failed to signup');
        }
        
        // Show success popup and redirect to login
        setNotification({
          type: 'success',
          message: 'Account created successfully! Redirecting to login...'
        });
        
        setTimeout(() => {
          onNavigateToLogin?.();
        }, 2000);
        
      } catch (error) {
        console.error('Signup error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
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
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Sign up to get started with your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 ${
                    touched.fullName && errors.fullName
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {touched.fullName && errors.fullName && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 ${
                    touched.email && errors.email
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {touched.email && errors.email && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 ${
                    touched.password && errors.password
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Optional Address Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information (Optional)</h3>
              <div className="space-y-4">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      onKeyDown={(e) => {
                        // Allow: numbers, plus, space, backspace, delete, tab, enter, escape, arrow keys
                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '+', ' '];
                        if (!/[0-9+ ]/.test(e.key) && !allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 ${
                        touched.phone && errors.phone
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                      placeholder="+20 11 12345678"
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 ${
                        touched.address && errors.address
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                      placeholder="123 Main St"
                    />
                  </div>
                  {touched.address && errors.address && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.address}
                    </div>
                  )}
                </div>

                {/* City and Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      onBlur={() => handleBlur('city')}
                      className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 ${
                        touched.city && errors.city
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                      placeholder="New York"
                    />
                    {touched.city && errors.city && (
                      <div className="mt-2 flex items-center text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.city}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      onBlur={() => handleBlur('postalCode')}
                      className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 ${
                        touched.postalCode && errors.postalCode
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                      placeholder="10001"
                    />
                    {touched.postalCode && errors.postalCode && (
                      <div className="mt-2 flex items-center text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.postalCode}
                      </div>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    onBlur={() => handleBlur('country')}
                    className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 ${
                      touched.country && errors.country
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white'
                    }`}
                    placeholder="United States"
                  />
                  {touched.country && errors.country && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.country}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Create Account
            </button>
          </form>

          {/* Toggle to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="ml-1 text-purple-600 hover:text-purple-500 font-medium"
              >
                Sign in
              </button>
            </p>
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
