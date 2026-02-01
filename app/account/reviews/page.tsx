'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Edit,
  Trash2,
  Search,
  Filter,
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Sparkles,
  Brush,
  Eye as EyeOutline,
  Package,
  Check,
  X
} from 'lucide-react';
import { Star as StarSolid } from 'lucide-react';
import type { ProductReview } from '@/types/user';

// Icon mapping for product categories
const getProductIcon = (productName: string) => {
  if (productName.toLowerCase().includes('serum') || productName.toLowerCase().includes('cream')) {
    return <Sparkles className="w-8 h-8 text-purple-400" />;
  }
  if (productName.toLowerCase().includes('lipstick')) {
    return <Brush className="w-8 h-8 text-pink-400" />;
  }
  if (productName.toLowerCase().includes('mascara') || productName.toLowerCase().includes('eye')) {
    return <EyeOutline className="w-8 h-8 text-blue-400" />;
  }
  if (productName.toLowerCase().includes('palette')) {
    return <Package className="w-8 h-8 text-yellow-400" />;
  }
  if (productName.toLowerCase().includes('brush')) {
    return <Brush className="w-8 h-8 text-orange-400" />;
  }
  if (productName.toLowerCase().includes('nail')) {
    return <Sparkles className="w-8 h-8 text-red-400" />;
  }
  return <Sparkles className="w-8 h-8 text-purple-400" />;
};

// Mock review data
const mockReviews: ProductReview[] = [
  {
    id: '1',
    productId: 'prod-001',
    productName: 'Premium Face Serum',
    productImage: <Sparkles className="w-8 h-8 text-purple-400" />,
    rating: 5,
    title: 'Amazing Product!',
    content: 'This face serum has completely transformed my skin. It feels so smooth and hydrated after just a week of use. The packaging is also beautiful and the scent is lovely. Highly recommend!',
    isVerified: true,
    helpfulCount: 24,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    productId: 'prod-002',
    productName: 'Luxury Lipstick Set',
    productImage: <Brush className="w-8 h-8 text-pink-400" />,
    rating: 4,
    title: 'Great colors, long lasting',
    content: 'The colors in this set are beautiful and very pigmented. They last for hours without needing to reapply. My only complaint is that the formula is a bit drying, so make sure to use lip balm underneath.',
    isVerified: true,
    helpfulCount: 18,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    productId: 'prod-003',
    productName: 'Organic Face Cream',
    productImage: <Sparkles className="w-8 h-8 text-green-400" />,
    rating: 3,
    title: 'Good but not amazing',
    content: 'This is a decent face cream. It\'s lightweight and absorbs quickly, but I didn\'t see any dramatic improvements in my skin. The price point is good for the quality though.',
    isVerified: true,
    helpfulCount: 7,
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2023-12-28')
  },
  {
    id: '4',
    productId: 'prod-004',
    productName: 'Eye Shadow Palette',
    productImage: <Package className="w-8 h-8 text-yellow-400" />,
    rating: 5,
    title: 'Beautiful pigmentation!',
    content: 'The pigmentation in these eyeshadows is incredible! They blend so easily and last all day without creasing. The color selection is perfect for both day and night looks. Will definitely repurchase.',
    isVerified: true,
    helpfulCount: 32,
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-15')
  },
  {
    id: '5',
    productId: 'prod-005',
    productName: 'Mascara Deluxe',
    productImage: <EyeOutline className="w-8 h-8 text-blue-400" />,
    rating: 4,
    title: 'Great volume and length',
    content: 'This mascara gives great volume and length to my lashes. I love the brush design - it separates the lashes perfectly. It can smudge a bit if you have watery eyes, but overall it\'s a great product.',
    isVerified: true,
    helpfulCount: 15,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  }
];

// Mock products that can be reviewed
const mockReviewableProducts = [
  {
    id: 'prod-006',
    name: 'Blush Brush Set',
    image: <Brush className="w-8 h-8 text-orange-400" />,
    orderDate: new Date('2024-01-20'),
    canReview: true
  },
  {
    id: 'prod-007',
    name: 'Nail Polish Collection',
    image: <Sparkles className="w-8 h-8 text-red-400" />,
    orderDate: new Date('2024-01-18'),
    canReview: true
  }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [activeTab, setActiveTab] = useState('my-reviews');

  const tabs = [
    { id: 'my-reviews', name: 'My Reviews', count: reviews.length },
    { id: 'write-review', name: 'Write Review', count: mockReviewableProducts.length }
  ];

  useState(() => {
    let filtered = [...reviews];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rating
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    // Sort reviews
    switch (sortBy) {
      case 'dateDesc':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'dateAsc':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'ratingDesc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'ratingAsc':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
    }

    setFilteredReviews(filtered);
  });

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform`}
            disabled={!interactive}
          >
            {i < rating ? (
              <StarSolid className="w-5 h-5 text-yellow-400 fill-current" />
            ) : (
              <Star className="w-5 h-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">Manage your product reviews and help others make informed decisions</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* My Reviews Tab */}
        {activeTab === 'my-reviews' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search reviews..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="lg:w-48">
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="lg:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="dateDesc">Newest First</option>
                    <option value="dateAsc">Oldest First</option>
                    <option value="ratingDesc">Highest Rating</option>
                    <option value="ratingAsc">Lowest Rating</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || ratingFilter !== 'all'
                    ? 'No reviews found'
                    : 'You haven\'t written any reviews yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || ratingFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Start reviewing products to help other customers make informed decisions'}
                </p>
                {reviews.length === 0 && (
                  <button
                    onClick={() => setActiveTab('write-review')}
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Write Your First Review
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                          {review.productImage}
                        </div>

                        {/* Product Info */}
                        <div>
                          <Link
                            href={`/products/${review.productId}`}
                            className="text-lg font-medium text-gray-900 hover:text-purple-600 transition"
                          >
                            {review.productName}
                          </Link>
                          <div className="flex items-center space-x-4 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-600">
                              {review.createdAt.toLocaleDateString()}
                            </span>
                            {review.isVerified && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Eye className="w-3 h-3 mr-1" />
                                Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-900">{review.title}</h3>
                      <p className="text-gray-700">{review.content}</p>
                    </div>

                    {/* Review Stats */}
                    <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <Heart className="w-4 h-4 mr-1" />
                        {review.helpfulCount} helpful
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        0 comments
                      </div>
                      {review.updatedAt.getTime() !== review.createdAt.getTime() && (
                        <div className="text-sm text-gray-500">
                          Updated: {review.updatedAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Write Review Tab */}
        {activeTab === 'write-review' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Products to Review</h2>

              {mockReviewableProducts.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products to review</h3>
                  <p className="text-gray-600 mb-6">
                    Once you make a purchase, you can review the products here
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockReviewableProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                          {product.image}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            Purchased: {product.orderDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/account/reviews/write?productId=${product.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Write Review
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Guidelines */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Guidelines</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-gray-700">Be honest and detailed in your review</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-gray-700">Include information about product quality, packaging, and results</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-gray-700">Mention your skin type or concerns if relevant</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </div>
                  <p className="text-gray-700">Don't include personal information like phone numbers or addresses</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </div>
                  <p className="text-gray-700">Don't post fake reviews or reviews for competitors</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
