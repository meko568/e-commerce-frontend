import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, DollarSign, Package, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Hash } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  short_description: string;
  long_description: string;
  price: number;
  sale_price: number | null;
  current_price: number;
  has_sale: boolean;
  stock: number;
  main_image: string;
  additional_images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductData {
  name: string;
  short_description: string;
  long_description: string;
  price: string;
  sale_price: string;
  stock: string;
  main_image: File | null;
  additional_images: File[];
  is_active: boolean;
}

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProductForm({ product, onClose, onSuccess }: EditProductFormProps) {
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    short_description: '',
    long_description: '',
    price: '',
    sale_price: '',
    stock: '',
    main_image: null,
    additional_images: [],
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    setProductData({
      name: product.name || '',
      short_description: product.short_description || '',
      long_description: product.long_description || '',
      price: product.price ? product.price.toString() : '',
      sale_price: product.sale_price ? product.sale_price.toString() : '',
      stock: product.stock ? product.stock.toString() : '',
      main_image: null,
      additional_images: [],
      is_active: product.is_active ?? true
    });
    setMainImagePreview(product.main_image || '');
    setAdditionalImagePreviews(product.additional_images);
  }, [product]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductData(prev => ({ ...prev, main_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProductData(prev => ({ ...prev, additional_images: files }));
    
    const previews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          setAdditionalImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!productData.name || !productData.name.trim()) newErrors.name = 'Product name is required';
    if (!productData.short_description || !productData.short_description.trim()) newErrors.short_description = 'Short description is required';
    if (!productData.long_description || !productData.long_description.trim()) newErrors.long_description = 'Long description is required';
    if (!productData.price || parseFloat(productData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (productData.sale_price && parseFloat(productData.sale_price) >= parseFloat(productData.price)) {
      newErrors.sale_price = 'Sale price must be less than regular price';
    }
    if (!productData.stock || parseInt(productData.stock) < 0) newErrors.stock = 'Stock must be 0 or greater';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('short_description', productData.short_description);
      formData.append('long_description', productData.long_description);
      formData.append('price', productData.price);
      if (productData.sale_price) {
        formData.append('sale_price', productData.sale_price);
      }
      formData.append('stock', productData.stock);
      formData.append('is_active', productData.is_active ? '1' : '0');
      
      if (productData.main_image) {
        formData.append('main_image', productData.main_image);
      }
      
      productData.additional_images.forEach((image) => {
        formData.append('additional_images[]', image);
      });

      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('You must be logged in to update products');
        return;
      }

      // Add method override for file uploads
      formData.append('_method', 'PUT');

      const response = await fetch(`http://127.0.0.1:8000/api/products/${product.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication failed. Please log in again.');
        } else if (response.status === 400) {
          // Handle validation errors
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat().join(', ');
            toast.error(`Validation error: ${errorMessages}`);
          } else {
            toast.error(data.message || 'Validation failed. Please check your input.');
          }
        } else {
          console.error('Validation errors:', data.errors);
          toast.error(data.message || 'Failed to update product');
        }
        return;
      }

      toast.success('Product updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Product update error:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Product Name
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Short Description
                </label>
                <textarea
                  value={productData.short_description}
                  onChange={(e) => setProductData(prev => ({ ...prev, short_description: e.target.value }))}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                    errors.short_description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief product description (max 500 characters)"
                />
                {errors.short_description && (
                  <p className="mt-1 text-sm text-red-600">{errors.short_description}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Long Description
                </label>
                <textarea
                  value={productData.long_description}
                  onChange={(e) => setProductData(prev => ({ ...prev, long_description: e.target.value }))}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                    errors.long_description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Detailed product description"
                />
                {errors.long_description && (
                  <p className="mt-1 text-sm text-red-600">{errors.long_description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Regular Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={productData.price}
                  onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Sale Price ($) (Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={productData.sale_price}
                  onChange={(e) => setProductData(prev => ({ ...prev, sale_price: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                    errors.sale_price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.sale_price && (
                  <p className="mt-1 text-sm text-red-600">{errors.sale_price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={productData.stock}
                  onChange={(e) => setProductData(prev => ({ ...prev, stock: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                    errors.stock ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={productData.is_active}
                  onChange={(e) => setProductData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Active (visible to customers)
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  Main Image (Leave empty to keep current)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to change main image</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {mainImagePreview && (
                    <div className="w-32 h-32">
                      <img
                        src={mainImagePreview}
                        alt="Main image preview"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  Additional Images (Leave empty to keep current)
                </label>
                <div className="space-y-4">
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to change additional images</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB each</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="hidden"
                    />
                  </label>
                  
                  {additionalImagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="w-full h-24">
                          <img
                            src={preview}
                            alt={`Additional image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
