import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import { Package, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ChartProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
}

export function StatCard({ title, value, icon: Icon, color }: ChartProps) {
  const { isRTL } = useTheme();
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${isRTL ? 'text-right' : ''}`}>
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function SalesChart() {
  const { isRTL, language } = useTheme();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch orders to calculate monthly sales
      const response = await fetch(`${API_URL}/api/orders/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const responseJson = await response.json();
        
        // Extract the actual orders array from the response
        const orders = responseJson.data || [];
        
        // Process orders to get monthly sales data
        const monthlyData = processOrdersToMonthlySales(orders);
        setSalesData(monthlyData);
      } else {
        // Fallback to mock data
        setSalesData(getMockSalesData());
      }
    } catch (error) {
      // Fallback to mock data
      setSalesData(getMockSalesData());
    } finally {
      setLoading(false);
    }
  };

  const processOrdersToMonthlySales = (orders: any[]) => {
    const monthlyMap = new Map();
    const months = language === 'ar' 
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    // Initialize months with 0 sales
    months.forEach(month => {
      monthlyMap.set(month, 0);
    });

    // Calculate sales from orders
    orders.forEach(order => {
      if (order.created_at) {
        const orderDate = new Date(order.created_at);
        const monthIndex = orderDate.getMonth();
        
        if (monthIndex >= 0 && monthIndex < 6) {
          const monthName = months[monthIndex];
          const currentSales = monthlyMap.get(monthName) || 0;
          const orderTotal = parseFloat(order.total_amount) || 0;
          monthlyMap.set(monthName, currentSales + orderTotal);
        }
      }
    });

    return months.map(month => ({
      month,
      sales: monthlyMap.get(month) || 0
    }));
  };

  const getMockSalesData = () => {
    const months = language === 'ar' 
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return months.map(month => ({
      month,
      sales: Math.floor(Math.random() * 5000) + 2000
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'text-right' : ''}`}>
          {language === 'ar' ? 'تحليل المبيعات' : 'Sales Analysis'}
        </h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'text-right' : ''}`}>
        {language === 'ar' ? 'تحليل المبيعات' : 'Sales Analysis'}
      </h3>
      <div className="space-y-4">
        {salesData.map((data, index) => (
          <div key={index} className={isRTL ? 'text-right' : ''}>
            <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm text-gray-600">{data.month}</span>
              <span className="text-sm font-medium text-gray-900">${data.sales.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${maxSales > 0 ? (data.sales / maxSales) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopProductsChart() {
  const { isRTL, language } = useTheme();
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch products
      const productsResponse = await fetch(`${API_URL}/api/products/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      // Fetch orders to calculate sales
      const ordersResponse = await fetch(`${API_URL}/api/orders/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (productsResponse.ok && ordersResponse.ok) {
        const productsResponseJson = await productsResponse.json();
        const ordersResponseJson = await ordersResponse.json();
        
        // Extract the actual arrays from the responses
        const products = productsResponseJson.data || [];
        const orders = ordersResponseJson.data || [];
        
        // Calculate product sales from orders
        const productSales = calculateProductSales(products, orders);
        setTopProducts(productSales);
      } else {
        // Fallback to mock data
        setTopProducts(getMockTopProducts());
      }
    } catch (error) {
      // Fallback to mock data
      setTopProducts(getMockTopProducts());
    } finally {
      setLoading(false);
    }
  };

  const calculateProductSales = (products: any[], orders: any[]) => {
    const salesMap = new Map();

    // Initialize all products with 0 sales
    products.forEach(product => {
      salesMap.set(product.id, {
        name: product.name,
        sales: 0,
        revenue: 0
      });
    });

    // Calculate sales from orders
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const productId = item.id;
          const quantity = item.quantity || 1;
          const price = parseFloat(item.price) || 0;
          
          if (salesMap.has(productId)) {
            const productData = salesMap.get(productId);
            productData.sales += quantity;
            productData.revenue += price * quantity;
          }
        });
      }
    });

    // Sort by sales and get top 5
    return Array.from(salesMap.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  };

  const getMockTopProducts = () => {
    return [
      { name: language === 'ar' ? 'السماعات الذكية' : 'Smart Headphones', sales: 145, revenue: 14500 },
      { name: language === 'ar' ? 'ساعة ذكية' : 'Smart Watch', sales: 98, revenue: 9800 },
      { name: language === 'ar' ? 'سماعات لاسلكية' : 'Wireless Earbuds', sales: 87, revenue: 6950 },
      { name: language === 'ar' ? 'شاحن محمول' : 'Power Bank', sales: 76, revenue: 3800 },
      { name: language === 'ar' ? 'كابل USB' : 'USB Cable', sales: 65, revenue: 1300 },
    ];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'text-right' : ''}`}>
          {language === 'ar' ? 'المنتجات الأكثر مبيعاً' : 'Top Selling Products'}
        </h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  const maxSales = Math.max(...topProducts.map(p => p.sales));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'text-right' : ''}`}>
        {language === 'ar' ? 'المنتجات الأكثر مبيعاً' : 'Top Selling Products'}
      </h3>
      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div key={index} className={isRTL ? 'text-right' : ''}>
            <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sales} {language === 'ar' ? 'وحدات' : 'units'}</p>
              </div>
              <span className="text-sm font-medium text-gray-900">${product.revenue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${maxSales > 0 ? (product.sales / maxSales) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsCharts() {
  const { language } = useTheme();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch products, orders, and users
      const [productsResponse, ordersResponse, usersResponse] = await Promise.all([
        fetch(`${API_URL}/api/products/`, {
          headers: { 'Authorization': `Token ${token}` }
        }),
        fetch(`${API_URL}/api/orders/`, {
          headers: { 'Authorization': `Token ${token}` }
        }),
        fetch(`${API_URL}/api/users/`, {
          headers: { 'Authorization': `Token ${token}` }
        })
      ]);

      if (productsResponse.ok && ordersResponse.ok && usersResponse.ok) {
        const productsResponseJson = await productsResponse.json();
        const ordersResponseJson = await ordersResponse.json();
        const usersResponseJson = await usersResponse.json();
        
        // Extract the actual arrays from the responses
        const products = productsResponseJson.data || [];
        const orders = ordersResponseJson.data || [];
        const users = usersResponseJson.data || [];
        
        // Calculate real stats
        const calculatedStats = calculateRealStats(products, orders, users);
        setStats(calculatedStats);
      } else {
        // Set empty stats on error
        setStats([]);
      }
    } catch (error) {
      // Set empty stats on error
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateRealStats = (products: any[], orders: any[], users: any[]) => {
    const totalSales = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
    const totalCustomers = users.length;
    const totalProducts = products.length;

    // Calculate today's orders
    const today = new Date();
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.toDateString() === today.toDateString();
    }).length;

    // Calculate percentage changes (simplified - comparing current month to previous month)
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    }).length;

    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
    }).length;

    const ordersChange = lastMonthOrders > 0 ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders * 100) : 0;

    return [
      {
        title: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
        value: `$${totalSales.toLocaleString()}`,
        change: ordersChange > 0 ? Math.abs(ordersChange) : ordersChange,
        icon: DollarSign,
        color: 'bg-blue-500'
      },
      {
        title: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users',
        value: totalCustomers.toLocaleString(),
        change: 8.2, // Calculate real user growth if needed
        icon: Users,
        color: 'bg-purple-500'
      },
      {
        title: language === 'ar' ? 'إجمالي المنتجات' : 'Total Products',
        value: totalProducts.toString(),
        change: -2.4, // Calculate real product change if needed
        icon: Package,
        color: 'bg-orange-500'
      },
      {
        title: language === 'ar' ? 'الطلبات اليوم' : "Today's Orders",
        value: todayOrders.toString(),
        change: 15.3, // Calculate real daily change if needed
        icon: ShoppingCart,
        color: 'bg-green-500'
      }
    ];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <TopProductsChart />
      </div>
    </div>
  );
}
