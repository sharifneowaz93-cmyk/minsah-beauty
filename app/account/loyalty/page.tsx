'use client';

import { useState } from 'react';
import {
  Star,
  Gift,
  Ticket,
  Clock,
  CheckCircle,
  RefreshCw,
  Calendar,
  ShoppingBag,
  Edit,
  Sparkles,
  Crown,
  Heart
} from 'lucide-react';
import { Star as StarSolidIcon } from 'lucide-react';
import { LOYALTY_CONFIG } from '@/types/user';
import type { LoyaltyTransaction } from '@/types/user';

// Mock data
const mockUserLoyalty = {
  currentPoints: 2450,
  lifetimePoints: 12500,
  tier: 'vip',
  nextTierPoints: 5000,
  tierProgress: 49, // percentage to next tier
  monthlyEarned: 320,
  pointsExpiring: 150,
  expiryDate: new Date('2024-02-28')
};

const mockTransactions: LoyaltyTransaction[] = [
  {
    id: '1',
    type: 'earned',
    points: 100,
    description: 'Welcome bonus for signing up',
    createdAt: new Date('2023-01-15'),
    expiresAt: new Date('2024-01-15')
  },
  {
    id: '2',
    type: 'earned',
    points: 50,
    description: 'Order #MB-2024-001',
    orderId: 'MB-2024-001',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    type: 'earned',
    points: 25,
    description: 'Product review for Premium Face Serum',
    createdAt: new Date('2024-01-10')
  },
  {
    id: '4',
    type: 'redeemed',
    points: 500,
    description: '$5 off coupon',
    createdAt: new Date('2024-01-08')
  },
  {
    id: '5',
    type: 'earned',
    points: 75,
    description: 'Order #MB-2024-002',
    orderId: 'MB-2024-002',
    createdAt: new Date('2024-01-05')
  },
  {
    id: '6',
    type: 'earned',
    points: 1000,
    description: 'Successful referral: jane.smith@example.com',
    createdAt: new Date('2023-12-20')
  }
];

const loyaltyTiers = [
  {
    name: 'Customer',
    minPoints: 0,
    icon: Star,
    color: 'gray',
    benefits: [
      '1 point per $1 spent',
      'Birthday bonus: 50 points',
      'Standard customer support'
    ]
  },
  {
    name: 'VIP',
    minPoints: 1000,
    icon: Heart,
    color: 'purple',
    benefits: [
      '1.2x points on all purchases',
      'Birthday bonus: 100 points',
      'Priority customer support',
      'Exclusive access to sales',
      'Free shipping on orders over $50'
    ]
  },
  {
    name: 'Premium',
    minPoints: 5000,
    icon: Crown,
    color: 'yellow',
    benefits: [
      '1.5x points on all purchases',
      'Birthday bonus: 200 points',
      'Dedicated customer support',
      'Early access to new products',
      'Free shipping on all orders',
      'Personal beauty consultant',
      'Anniversary bonus: 150 points'
    ]
  }
];

const rewards = [
  {
    id: '1',
    name: '$5 Off Coupon',
    points: 500,
    description: 'Get $5 off your next purchase',
    category: 'discount'
  },
  {
    id: '2',
    name: '$10 Off Coupon',
    points: 900,
    description: 'Get $10 off your next purchase',
    category: 'discount'
  },
  {
    id: '3',
    name: 'Free Shipping',
    points: 300,
    description: 'Free shipping on your next order',
    category: 'shipping'
  },
  {
    id: '4',
    name: 'Premium Face Serum',
    points: 2500,
    description: 'Redeem our premium face serum',
    category: 'product'
  },
  {
    id: '5',
    name: 'Beauty Box',
    points: 3000,
    description: 'Exclusive curated beauty box',
    category: 'product'
  }
];

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReward, setSelectedReward] = useState<typeof rewards[0] | null>(null);

  const userTier = loyaltyTiers.find(tier => tier.name.toLowerCase() === mockUserLoyalty.tier) || loyaltyTiers[0];
  const nextTier = loyaltyTiers.find(tier => tier.minPoints > userTier.minPoints);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Star },
    { id: 'history', name: 'History', icon: Clock },
    { id: 'rewards', name: 'Rewards', icon: Gift }
  ];

  const getUserTierIcon = () => {
    const IconComponent = userTier.icon;
    return <IconComponent className="w-6 h-6" />;
  };

  const formatPoints = (points: number) => {
    return points.toLocaleString();
  };

  const getTransactionIcon = (type: 'earned' | 'redeemed') => {
    return type === 'earned' ? (
      <RefreshCw className="w-5 h-5 text-green-500" />
    ) : (
      <Gift className="w-5 h-5 text-purple-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Program</h1>
          <p className="text-gray-600">Earn points and unlock exclusive rewards</p>
        </div>

        {/* Points Overview Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Current Points */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <StarSolidIcon className="w-5 h-5" />
                <span className="text-white/80 text-sm">Current Balance</span>
              </div>
              <p className="text-3xl font-bold">{formatPoints(mockUserLoyalty.currentPoints)}</p>
              <p className="text-white/80 text-sm mt-1">points</p>
            </div>

            {/* Lifetime Points */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-white/80 text-sm">Lifetime Points</span>
              </div>
              <p className="text-2xl font-bold">{formatPoints(mockUserLoyalty.lifetimePoints)}</p>
            </div>

            {/* Monthly Earned */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-white/80 text-sm">This Month</span>
              </div>
              <p className="text-2xl font-bold">+{formatPoints(mockUserLoyalty.monthlyEarned)}</p>
            </div>

            {/* Points Expiring */}
            {mockUserLoyalty.pointsExpiring > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-white/80 text-sm">Expiring Soon</span>
                </div>
                <p className="text-2xl font-bold">{formatPoints(mockUserLoyalty.pointsExpiring)}</p>
                <p className="text-white/80 text-xs">
                  by {mockUserLoyalty.expiryDate.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
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
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Tier Status */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Tier Status</h2>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-${userTier.color}-100 text-${userTier.color}-600`}>
                        {getUserTierIcon()}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{userTier.name} Member</h3>
                        <p className="text-gray-600">{formatPoints(mockUserLoyalty.lifetimePoints)} lifetime points</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress to Next Tier */}
                  {nextTier && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress to {nextTier.name}</span>
                        <span className="font-medium text-gray-900">{mockUserLoyalty.tierProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${mockUserLoyalty.tierProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {formatPoints(nextTier.minPoints - mockUserLoyalty.lifetimePoints)} points to next tier
                      </p>
                    </div>
                  )}

                  {/* Current Tier Benefits */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Your Benefits</h4>
                    <ul className="space-y-2">
                      {userTier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* How to Earn Points */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">How to Earn Points</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <ShoppingBag className="w-6 h-6 text-purple-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900">Shop</h3>
                        <p className="text-gray-600 text-sm">
                          {LOYALTY_CONFIG.points_per_dollar} points per $1 spent
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Edit className="w-6 h-6 text-purple-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900">Write Reviews</h3>
                        <p className="text-gray-600 text-sm">
                          {LOYALTY_CONFIG.points_for_review} points per review
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Heart className="w-6 h-6 text-purple-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900">Refer Friends</h3>
                        <p className="text-gray-600 text-sm">
                          {LOYALTY_CONFIG.points_for_referral_signup} points when they sign up
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Gift className="w-6 h-6 text-purple-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900">Birthday Bonus</h3>
                        <p className="text-gray-600 text-sm">
                          Special bonus points on your birthday
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Points History</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {mockTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-600">
                                {transaction.createdAt.toLocaleDateString()}
                              </span>
                              {transaction.expiresAt && (
                                <span className="text-sm text-orange-600">
                                  Expires: {transaction.expiresAt.toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={`font-semibold ${
                          transaction.type === 'earned' ? 'text-green-600' : 'text-purple-600'
                        }`}>
                          {transaction.type === 'earned' ? '+' : '-'}{formatPoints(transaction.points)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Rewards</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-gray-900">{reward.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">{reward.description}</p>
                          </div>
                          <Ticket className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-purple-600">
                            {formatPoints(reward.points)} points
                          </span>
                          <button
                            onClick={() => setSelectedReward(reward)}
                            disabled={reward.points > mockUserLoyalty.currentPoints}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                              reward.points <= mockUserLoyalty.currentPoints
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {reward.points <= mockUserLoyalty.currentPoints ? 'Redeem' : 'Insufficient Points'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Points to $1</span>
                    <span className="font-medium text-gray-900">{LOYALTY_CONFIG.redemption_rate}:1</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    ${Math.floor(mockUserLoyalty.currentPoints / LOYALTY_CONFIG.redemption_rate)} available for redemption
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium text-gray-900">Jan 2023</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Points Earned This Year</span>
                    <span className="font-medium text-gray-900">{formatPoints(mockUserLoyalty.monthlyEarned * 12)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* All Tiers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">All Tiers</h3>
              <div className="space-y-4">
                {loyaltyTiers.map((tier) => {
                  const IconComponent = tier.icon;
                  const isActive = tier.name.toLowerCase() === mockUserLoyalty.tier;
                  const isCompleted = mockUserLoyalty.lifetimePoints >= tier.minPoints;

                  return (
                    <div
                      key={tier.name}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        isActive ? 'bg-purple-50 border border-purple-200' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : isCompleted
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{tier.name}</h4>
                        <p className="text-sm text-gray-600">
                          {formatPoints(tier.minPoints)} points
                        </p>
                      </div>
                      {isActive && (
                        <span className="text-xs font-medium text-purple-600">Current</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Reward Redemption Modal */}
        {selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Redemption</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900">{selectedReward.name}</h4>
                <p className="text-gray-600 text-sm mt-1">{selectedReward.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-600">Cost</span>
                  <span className="font-semibold text-purple-600">
                    {formatPoints(selectedReward.points)} points
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-6">
                <span>Balance after redemption</span>
                <span className="font-medium text-gray-900">
                  {formatPoints(mockUserLoyalty.currentPoints - selectedReward.points)} points
                </span>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedReward(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle redemption
                    console.log('Redeeming reward:', selectedReward.id);
                    setSelectedReward(null);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Redeem Reward
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
