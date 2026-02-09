import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Package, DollarSign, Hash, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../contexts/NavigationContext';
import { CommentsSection } from '../components/CommentsSection';

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

export function ProductPage() {
  const { navigate, currentProductId } = useNavigation();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/products/${currentProductId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Product not found');
        }

        setProduct(data.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchProduct();
    }
  }, [currentProductId]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      toast.error(product?.stock === 0 ? 'Product is out of stock' : 'Product not loaded');
      return;
    }
    
    addToCart(product, quantity);
  };

  const handleAddToWishlist = () => {
    if (product) {
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const handleShare = () => {
    if (product) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard');
    }
  };

  const handleNextImage = () => {
    if (product && currentImageIndex < product.additional_images.length) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const allImages = product ? [product.main_image, ...product.additional_images] : [];
  const currentImage = allImages[currentImageIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('home')}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                title="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleAddToWishlist}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                title="Add to wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Product Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Product+Image';
                }}
              />
              
              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    disabled={currentImageIndex === allImages.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex
                        ? 'border-cyan-500'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-cyan-400">
                    ${parseFloat(product.current_price).toFixed(2)}
                  </span>
                  {product.has_sale && (
                    <span className="text-lg text-gray-400 line-through">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.has_sale && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className={`font-medium ${
                product.stock > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Description</h3>
              <p className="text-gray-300 leading-relaxed break-words overflow-wrap-anywhere">
                {product.long_description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-white font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-700 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-16 px-3 py-2 text-center bg-black text-white border-x border-gray-700 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Product Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">Top Rated</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">Best Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">In Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Comments Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <CommentsSection productId={currentProductId} />
      </div>
    </div>
  );
}
