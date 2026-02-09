import { useState, useEffect } from 'react';
import { Star, MessageCircle, Trash2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface Comment {
  id: number;
  comment: string;
  rating: number;
  user: {
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

interface CommentsSectionProps {
  productId: number;
}

export function CommentsSection({ productId }: CommentsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const { isRTL, t } = useTheme();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/comments`);
        const data = await response.json();

        if (data.success) {
          setComments(data.data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to add a comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          comment: newComment.trim(),
          rating: rating
        })
      });

      const data = await response.json();

      if (data.success) {
        setComments(prev => [data.data, ...prev]);
        setNewComment('');
        setRating(5);
        toast.success('Comment added successfully!');
      } else {
        toast.error(data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!isAuthenticated) return;

    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        toast.success('Comment deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const renderStars = (rating: number | null) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      return (
        <Star
          key={i}
          className={`w-4 h-4 ${
            rating !== null && starNumber <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      );
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews</h3>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <h3 className="text-xl font-semibold text-white mb-4">{t('customerReviews')}</h3>
      
      {/* Add Comment Form */}
      {isAuthenticated && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-medium text-white mb-4">{t('leaveReview')}</h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('rating')}
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 rounded ${
                      star <= rating
                        ? 'text-yellow-400'
                        : 'text-gray-400 hover:text-yellow-400'
                    } transition-colors`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('comment')}
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
                rows={4}
                placeholder={t('shareYourExperience')}
                maxLength={1000}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent border-r-transparent border-b-transparent animate-spin"></div>
                  {t('loading')}...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t('postReview')}
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">{t('noReviews')}</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 rounded-lg p-6">
              <div className={`flex items-start space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {comment.user.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <p className="font-medium text-white">{comment.user.name}</p>
                      <p className="text-sm text-gray-400">{comment.user.email}</p>
                    </div>
                    
                    <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {comment.rating && renderStars(comment.rating)}
                      <span className="text-sm text-gray-400 ml-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">{comment.comment}</p>
                </div>
              </div>
              
              {/* Delete button for own comments */}
              {isAuthenticated && user?.email === comment.user.email && (
                <div className={`mt-4 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('delete')}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
