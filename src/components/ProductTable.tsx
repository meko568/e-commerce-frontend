import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, ToggleLeft, ToggleRight, Hash, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';

interface Product {
  id: number;
  name: string;
  short_description: string;
  long_description: string;
  price: string;
  sale_price: string | null;
  current_price: string;
  has_sale: boolean;
  stock: number;
  main_image: string;
  additional_images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductTableProps {
  onEditProduct: (product: Product) => void;
  refreshTrigger?: number;
}

export function ProductTable({ onEditProduct, refreshTrigger }: ProductTableProps) {
  const { isRTL, language } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://127.0.0.1:8000/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      setProducts(data.data || []);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('You must be logged in to delete products');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication failed. Please log in again.');
        } else {
          toast.error(data.message || 'Failed to delete product');
        }
        return;
      }

      // Refresh products list
      fetchProducts();
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };

  const handleToggleActive = async (productId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('You must be logged in to update products');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_active: !currentStatus
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication failed. Please log in again.');
        } else {
          toast.error(data.message || 'Failed to update product status');
        }
        return;
      }

      // Refresh products list
      fetchProducts();
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Failed to update product status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className={`text-gray-600 ${isRTL ? 'mr-2' : 'ml-2'}`}>
          {language === 'ar' ? 'جاري تحميل المنتجات...' : 'Loading products...'}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${isRTL ? 'text-right' : ''}`}>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {language === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${isRTL ? 'text-right' : ''}`}>
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {language === 'ar' ? 'لا توجد منتجات بعد' : 'No products yet'}
        </h3>
        <p className="text-gray-600">
          {language === 'ar' ? 'ابدأ بإضافة أول منتج لك.' : 'Get started by adding your first product.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className={`p-6 border-b border-gray-200 ${isRTL ? 'text-right' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-900">
          {language === 'ar' ? `المنتجات (${products.length})` : `Products (${products.length})`}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                {language === 'ar' ? 'المنتج' : 'Product'}
              </th>
              <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                {language === 'ar' ? 'السعر' : 'Price'}
              </th>
              <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                {language === 'ar' ? 'المخزون' : 'Stock'}
              </th>
              <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                {language === 'ar' ? 'الحالة' : 'Status'}
              </th>
              <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                {language === 'ar' ? 'الإجراءات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={product.main_image}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Image';
                        }}
                      />
                    </div>
                    <div className={isRTL ? 'mr-4' : 'ml-4'}>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.short_description.substring(0, 50)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${product.current_price ? parseFloat(product.current_price).toFixed(2) : parseFloat(product.price).toFixed(2)}
                    {product.has_sale && (
                      <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full`}>
                        {language === 'ar' ? 'تخفيض' : 'Sale'}
                      </span>
                    )}
                  </div>
                  {product.has_sale && product.sale_price && (
                    <div className="text-xs text-gray-500 line-through">
                      ${parseFloat(product.price).toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center text-sm text-gray-900 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Hash className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {product.stock}
                  </div>
                  <div className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 
                      ? (language === 'ar' ? 'متوفر' : 'In Stock')
                      : (language === 'ar' ? 'نفد المخزون' : 'Out of Stock')
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(product.id, product.is_active)}
                    className={`flex items-center text-sm ${
                      product.is_active ? 'text-green-600' : 'text-gray-400'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {product.is_active ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                    <span className={isRTL ? 'mr-1' : 'ml-1'}>
                      {product.is_active 
                        ? (language === 'ar' ? 'نشط' : 'Active')
                        : (language === 'ar' ? 'غير نشط' : 'Inactive')
                      }
                    </span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <button
                      onClick={() => onEditProduct(product)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title={language === 'ar' ? 'تعديل المنتج' : 'Edit product'}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title={language === 'ar' ? 'حذف المنتج' : 'Delete product'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
