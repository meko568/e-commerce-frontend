import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import { Eye, Package, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Order {
  id: number;
  user_info: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: string;
    quantity: number;
    total: string;
  }>;
  total_amount: string;
  status: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface OrderTableProps {
  refreshTrigger?: number;
}

export function OrderTable({ refreshTrigger }: OrderTableProps) {
  const { isRTL, language } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders(); // Refresh the orders list
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    // Show confirmation popup instead of default alert
    setOrderToDelete(orderId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/orders/${orderToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchOrders(); // Refresh the orders list
        setShowOrderDetails(false); // Close the order details modal if open
        setShowDeleteConfirm(false); // Close confirmation modal
        setOrderToDelete(null); // Reset the order to delete
        
        // Show success message
        setSuccessMessage('Order completed and deleted successfully!');
        setShowSuccessMessage(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      // Show error message
      setSuccessMessage(error instanceof Error ? error.message : 'Failed to delete order');
      setShowSuccessMessage(true);
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-400',
      processing: 'text-blue-400',
      shipped: 'text-purple-400',
      delivered: 'text-green-400',
      cancelled: 'text-red-400'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'text-gray-400',
      paid: 'text-green-400',
      failed: 'text-red-400',
      refunded: 'text-orange-400'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg mb-4">Error loading orders</p>
        <p className="text-gray-400">{error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className={`px-6 py-4 border-b border-gray-200 ${isRTL ? 'text-right' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'ar' ? 'الطلبات الأخيرة' : 'Recent Orders'}
          </h3>
        </div>
        
        {orders.length === 0 ? (
          <div className={`text-center py-12 ${isRTL ? 'text-right' : ''}`}>
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {language === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {language === 'ar' ? 'رقم الطلب' : 'Order ID'}
                  </th>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {language === 'ar' ? 'العميل' : 'Customer'}
                  </th>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {language === 'ar' ? 'الإجمالي' : 'Total'}
                  </th>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {language === 'ar' ? 'الدفع' : 'Payment'}
                  </th>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {language === 'ar' ? 'التاريخ' : 'Date'}
                  </th>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={`order-${order.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user_info.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user_info.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`text-sm font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(order.status)} bg-gray-800 focus:ring-2 focus:ring-cyan-500`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-cyan-600 hover:text-cyan-900 mr-3"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Complete Order (Delete)"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Order Details - #{selectedOrder.id}</h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-500" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.user_info.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.user_info.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Address:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOrder.user_info.address}, {selectedOrder.user_info.city}, {selectedOrder.user_info.country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-500" />
                  Order Items
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={`order-${selectedOrder.id}-item-${index}-${item.id || index}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${item.total}</p>
                        <p className="text-sm text-gray-500">${item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                  <span className="text-xl font-bold text-cyan-600">
                    ${parseFloat(selectedOrder.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Status */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Order Status:</p>
                    <span className={`font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Payment Status:</p>
                    <span className={`font-medium ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              {selectedOrder.status === 'delivered' && (
                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteOrder(selectedOrder.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete Order (Delete from DB)
                    </button>
                  </div>
                </div>
              )}

              {/* Order Notes */}
              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Admin Notes:</p>
                  <p className="text-gray-900">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Complete Order</h3>
                <p className="text-sm text-gray-600">Are you sure you want to complete and delete this order?</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-700">
                This action will permanently delete the order from the database. This cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setOrderToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrder}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Complete & Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Message Modal */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className={`rounded-lg border p-4 shadow-lg ${
            successMessage.includes('successfully') 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                successMessage.includes('successfully')
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}>
                <CheckCircle className={`w-4 h-4 ${
                  successMessage.includes('successfully')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`} />
              </div>
              <div>
                <p className={`font-medium ${
                  successMessage.includes('successfully')
                    ? 'text-green-900'
                    : 'text-red-900'
                }`}>
                  {successMessage.includes('successfully') ? 'Success!' : 'Error!'}
                </p>
                <p className={`text-sm ${
                  successMessage.includes('successfully')
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
