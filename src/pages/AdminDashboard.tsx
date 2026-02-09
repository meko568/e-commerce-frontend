import { useState, useEffect } from 'react';
import { User, Package, ShoppingCart, Settings, TrendingUp, Users, Menu, X, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ProfilePage } from '../components/ProfilePage';
import AddProductForm from '../components/AddProductForm';
import { ProductTable } from '../components/ProductTable';
import { EditProductForm } from '../components/EditProductForm';
import { OrderTable } from '../components/OrderTable';
import { AnalyticsCharts } from '../components/AnalyticsCharts';

export function AdminDashboard() {
  const { user } = useAuth();
  const { isRTL, language } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
  };

  const handleProductSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Calculate relative time
  const getRelativeTime = (orderDate: string) => {
    const now = new Date();
    const order = new Date(orderDate);
    const diffMs = now.getTime() - order.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return language === 'ar' ? 'الآن' : 'Just now';
    } else if (diffMins < 60) {
      return language === 'ar' ? `منذ ${diffMins} دقائق` : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return language === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours} hours ago`;
    } else {
      return language === 'ar' ? `منذ ${diffDays} أيام` : `${diffDays} days ago`;
    }
  };

  // Fetch recent orders
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/orders/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        if (response.ok) {
          const responseJson = await response.json();
          const orders = responseJson.data || [];
          // Get the 3 most recent orders
          const sortedOrders = orders.sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ).slice(0, 3);
          setRecentOrders(sortedOrders);
        }
      } catch (error) {
        // Keep empty array on error
        setRecentOrders([]);
      }
    };

    fetchRecentOrders();
  }, [refreshTrigger]);

  return (
    <div className={`min-h-screen bg-gray-50 flex ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')
      } ${isRTL ? 'lg:translate-x-0' : 'lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`flex items-center justify-between h-16 px-6 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <a
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Home className="w-5 h-5" />
              {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </a>
            <a
              href="#"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Package className="w-5 h-5" />
              {language === 'ar' ? 'المنتجات' : 'Products'}
            </a>
            <a
              href="#"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Users className="w-5 h-5" />
              {language === 'ar' ? 'المستخدمون' : 'Users'}
            </a>
            <a
              href="#"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {language === 'ar' ? 'الطلبات' : 'Orders'}
            </a>
            <a
              href="#analytics"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <TrendingUp className="w-5 h-5" />
              {language === 'ar' ? 'التحليلات' : 'Analytics'}
            </a>
            <a
              href="#"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Settings className="w-5 h-5" />
              {language === 'ar' ? 'الإعدادات' : 'Settings'}
            </a>
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={() => setShowProfile(true)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-50 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <User className="w-4 h-4" />
              {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isRTL ? 'lg:mr-64' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className={`flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? `مرحبا بعودتك، ${user?.name}!` : `Welcome back, ${user?.name}!`}
            </h2>
            <p className="text-gray-600">
              {language === 'ar' 
                ? 'إليك ما يحدث في متجرك اليوم.'
                : "Here's what's happening with your store today."
              }
            </p>
          </div>

          {/* Analytics Section */}
          <div id="analytics" className="mb-8">
            <AnalyticsCharts />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className={`p-6 border-b border-gray-200 ${isRTL ? 'text-right' : ''}`}>
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? 'الطلبات الأخيرة' : 'Recent Orders'}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                    <div key={order.id} className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className={isRTL ? 'text-right' : ''}>
                          <p className="font-medium text-gray-900">
                            {language === 'ar' ? `طلب #${order.id}` : `Order #${order.id}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {getRelativeTime(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className={isRTL ? 'text-left' : 'text-right'}>
                        <p className="font-medium text-gray-900">${parseFloat(order.total_amount || 0).toFixed(2)}</p>
                        <p className="text-sm text-green-600">
                          {language === 'ar' ? 'مكتمل' : 'Completed'}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      {language === 'ar' ? 'لا توجد طلبات حديثة' : 'No recent orders'}
                    </div>
                  )}
                </div>
                <button className={`w-full mt-4 text-center text-blue-600 hover:text-blue-500 font-medium text-sm ${isRTL ? 'text-right' : ''}`}>
                  {language === 'ar' ? 'عرض جميع الطلبات ←' : 'View all orders →'}
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className={`p-6 border-b border-gray-200 ${isRTL ? 'text-right' : ''}`}>
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowAddProduct(true)}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {language === 'ar' ? 'إضافة منتج' : 'Add Product'}
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Users className="w-8 h-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users'}
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {language === 'ar' ? 'عرض التحليلات' : 'View Analytics'}
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="w-8 h-8 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {language === 'ar' ? 'الإعدادات' : 'Settings'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="mt-8">
            <ProductTable 
              onEditProduct={handleEditProduct}
              refreshTrigger={refreshTrigger}
            />
          </div>

          {/* Orders Table */}
          <div className="mt-8">
            <OrderTable refreshTrigger={refreshTrigger} />
          </div>
        </main>
      </div>
      
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

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductForm
          onClose={() => setShowAddProduct(false)}
          onSuccess={handleProductSuccess}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            handleProductSuccess();
          }}
        />
      )}
    </div>
  );
}
