'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ORDER_STATUS } from '@/types/user';
import {
  ShoppingBag,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
  Brush,
  Eye,
  Package
} from 'lucide-react';
import { Star } from 'lucide-react';

// Icon mapping for product categories
const getProductIcon = (productName: string) => {
  if (productName.toLowerCase().includes('serum') || productName.toLowerCase().includes('cream')) {
    return <Sparkles className="w-8 h-8 text-purple-400" />;
  }
  if (productName.toLowerCase().includes('lipstick')) {
    return <Brush className="w-8 h-8 text-pink-400" />;
  }
  if (productName.toLowerCase().includes('mascara') || productName.toLowerCase().includes('eye')) {
    return <Eye className="w-8 h-8 text-blue-400" />;
  }
  if (productName.toLowerCase().includes('palette')) {
    return <Package className="w-8 h-8 text-yellow-400" />;
  }
  return <Sparkles className="w-8 h-8 text-purple-400" />;
};

// Mock data
const mockOrders = [
  {
    id: '1',
    orderNumber: 'MB-2024-001',
    status: 'delivered',
    paymentStatus: 'paid',
    items: [
      { id: '1', productName: 'Premium Face Serum', productImage: <Sparkles className="w-8 h-8 text-purple-400" />, quantity: 2, price: 29.99, totalPrice: 59.98 },
      { id: '2', productName: 'Luxury Lipstick Set', productImage: <Brush className="w-8 h-8 text-pink-400" />, quantity: 1, price: 24.99, totalPrice: 24.99 }
    ],
    total: 90.96,
    createdAt: new Date('2024-01-15'),
    estimatedDelivery: new Date('2024-01-20'),
    canReview: true
  },
  {
    id: '2',
    orderNumber: 'MB-2024-002',
    status: 'shipped',
    paymentStatus: 'paid',
    items: [
      { id: '3', productName: 'Organic Face Cream', productImage: <Sparkles className="w-8 h-8 text-green-400" />, quantity: 1, price: 45.99, totalPrice: 45.99 }
    ],
    total: 51.98,
    createdAt: new Date('2024-01-20'),
    estimatedDelivery: new Date('2024-01-25'),
    trackingNumber: 'TRK123456789',
    canReview: false
  },
  {
    id: '3',
    orderNumber: 'MB-2024-003',
    status: 'processing',
    paymentStatus: 'paid',
    items: [
      { id: '4', productName: 'Eye Shadow Palette', productImage: <Package className="w-8 h-8 text-yellow-400" />, quantity: 1, price: 35.99, totalPrice: 35.99 },
      { id: '5', productName: 'Mascara Deluxe', productImage: <Eye className="w-8 h-8 text-blue-400" />, quantity: 2, price: 19.99, totalPrice: 39.98 }
    ],
    total: 85.97,
    createdAt: new Date('2024-01-22'),
    estimatedDelivery: new Date('2024-01-28'),
    canReview: false
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const statusConfig = ORDER_STATUS[status as keyof typeof ORDER_STATUS];
    return statusConfig?.color || 'gray';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'You haven\'t placed any orders yet'}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Start Shopping
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order {order.orderNumber}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {order.createdAt.toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                            {ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]?.label || order.status}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-right mr-4">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      </div>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                          {item.productImage}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${item.totalPrice.toFixed(2)}</p>
                          {order.canReview && (
                            <Link
                              href={`/account/reviews/write?productId=${item.id}&orderId=${order.id}`}
                              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-500 mt-1"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Write Review
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {order.trackingNumber && (
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Truck className="w-4 h-4 mr-2" />
                        Track Package
                      </button>
                    )}
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Download Invoice
                    </button>
                    {(order.status === 'delivered' || order.status === 'shipped') && (
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Return/Exchange
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
