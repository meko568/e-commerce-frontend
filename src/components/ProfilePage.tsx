import React, { useState, useEffect } from 'react';
import { User, Mail, LogOut, Edit2, Save, X, Shield, Settings, Phone, MapPin } from 'lucide-react';
import { NotificationPopup } from './NotificationPopup';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { isRTL, language } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<ProfileData>>({});

  // Update profile data when user data is available
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postal_code || '',
        country: user.country || ''
      }));
    }
  }, [user]);

  const formatEgyptianPhone = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    
    // Always start with +20, then add the digits
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

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (password && password.length < 8) return 'Password must be at least 8 characters';
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (password && confirmPassword !== password) return 'Passwords do not match';
    return undefined;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<ProfileData> = {};
    newErrors.email = validateEmail(profileData.email);
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error !== undefined)) {
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/update-profile', {
        method: 'PUT',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          postal_code: profileData.postalCode,
          country: profileData.country
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update user context with new data
      if (data.user) {
        updateUser(data.user);
      }

      setNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });
      
      setIsEditing(false);
      
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setNotification({
        type: 'error',
        message: errorMessage
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<ProfileData> = {};
    newErrors.currentPassword = !profileData.currentPassword ? 'Current password is required' : undefined;
    newErrors.newPassword = validatePassword(profileData.newPassword);
    newErrors.confirmPassword = validateConfirmPassword(profileData.confirmPassword, profileData.newPassword);
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error !== undefined)) {
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/change-password', {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          current_password: profileData.currentPassword,
          new_password: profileData.newPassword,
          new_password_confirmation: profileData.confirmPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setNotification({
        type: 'success',
        message: 'Password changed successfully!'
      });
      
      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
    } catch (error) {
      console.error('Password change error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      setNotification({
        type: 'error',
        message: errorMessage
      });
    }
  };

  const handleLogout = () => {
    logout();
    // logout function already redirects to home page
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {language === 'ar' ? 'ملفي الشخصي' : 'My Profile'}
                  </h1>
                  <p className="text-gray-600">
                    {language === 'ar' ? 'إدارة إعدادات حسابك' : 'Manage your account settings'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <LogOut className="w-4 h-4" />
                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </button>
            </div>

              {/* Tabs */}
              <div className={`flex gap-4 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {language === 'ar' ? 'معلومات الملف الشخصي' : 'Profile Information'}
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === 'security'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {language === 'ar' ? 'الأمان' : 'Security'}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={`bg-white rounded-2xl shadow-xl p-8`}>
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'ar' ? 'معلومات الملف الشخصي' : 'Profile Information'}
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Edit2 className="w-4 h-4" />
                    {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                        {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900">{user?.name || (language === 'ar' ? 'غير محدد' : 'Not set')}</p>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900">{user?.email || (language === 'ar' ? 'غير محدد' : 'Not set')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="border-t pt-6">
                    <h3 className={`text-lg font-medium text-gray-900 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className="w-5 h-5 text-blue-500" />
                      {language === 'ar' ? 'معلومات العنوان' : 'Address Information'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                          {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-900">{user?.phone || (language === 'ar' ? 'غير محدد' : 'Not set')}</p>
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                          {language === 'ar' ? 'البلد' : 'Country'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-900">{user?.country || (language === 'ar' ? 'غير محدد' : 'Not set')}</p>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                          {language === 'ar' ? 'العنوان' : 'Address'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-900">{user?.address || (language === 'ar' ? 'غير محدد' : 'Not set')}</p>
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                          {language === 'ar' ? 'المدينة' : 'City'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-900">{user?.city || (language === 'ar' ? 'غير محدد' : 'Not set')}</p>
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                          {language === 'ar' ? 'الرمز البريدي' : 'Postal Code'}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-900">{user?.postal_code || (language === 'ar' ? 'غير محدد' : 'Not set')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          onKeyDown={(e) => {
                            // Allow: numbers, plus, space, backspace, delete, tab, enter, escape, arrow keys
                            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '+', ' '];
                            if (!/[0-9+ ]/.test(e.key) && !allowedKeys.includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          placeholder="+20 11 12345678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={profileData.country}
                          onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          placeholder="United States"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          placeholder="123 Main St"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                        <input
                          type="text"
                          value={profileData.postalCode}
                          onChange={(e) => setProfileData(prev => ({ ...prev, postalCode: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          address: user?.address || '',
                          city: user?.city || '',
                          postalCode: user?.postal_code || '',
                          country: user?.country || '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setErrors({});
                      }}
                      className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2>
                <p className="text-gray-600">Manage your password and security preferences</p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                        errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter current password"
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter new password"
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
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
    </>
  );
}
