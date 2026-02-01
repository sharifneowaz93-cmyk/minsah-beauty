'use client';

import { useState } from 'react';
import {
  Share2,
  Gift,
  Users,
  CheckCircle,
  Clock,
  Copy,
  RefreshCw,
  Mail,
  MessageSquare,
  DollarSign,
  Sparkles,
  X,
  ChevronRight,
  Star
} from 'lucide-react';
import { CheckCircle as CheckCircleSolid } from 'lucide-react';
import { LOYALTY_CONFIG } from '@/types/user';
import type { Referral } from '@/types/user';

// Mock data
const mockReferralData = {
  referralCode: 'JOHN2024',
  referralLink: 'https://minsahbeauty.com/referral/JOHN2024',
  totalReferrals: 8,
  successfulReferrals: 5,
  pendingReferrals: 3,
  totalEarned: 3500,
  referralStats: {
    thisMonth: 2,
    lastMonth: 3,
    lifetime: 5
  },
  rewards: {
    signupBonus: LOYALTY_CONFIG.points_for_referral_signup,
    purchaseBonus: LOYALTY_CONFIG.points_for_referral_purchase,
    totalPotential: 7500 // Based on 5 successful referrals
  }
};

const mockReferrals: Referral[] = [
  {
    id: '1',
    referralCode: 'JOHN2024',
    referredEmail: 'sarah.johnson@email.com',
    referredName: 'Sarah Johnson',
    status: 'completed',
    rewardPoints: 1500,
    createdAt: new Date('2024-01-10'),
    completedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    referralCode: 'JOHN2024',
    referredEmail: 'mike.wilson@email.com',
    referredName: 'Mike Wilson',
    status: 'made_purchase',
    rewardPoints: 1500,
    createdAt: new Date('2024-01-08'),
    completedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    referralCode: 'JOHN2024',
    referredEmail: 'emma.brown@email.com',
    referredName: 'Emma Brown',
    status: 'made_purchase',
    rewardPoints: 1000,
    createdAt: new Date('2024-01-05'),
    completedAt: new Date('2024-01-10')
  },
  {
    id: '4',
    referralCode: 'JOHN2024',
    referredEmail: 'david.lee@email.com',
    referredName: 'David Lee',
    status: 'signed_up',
    rewardPoints: 500,
    createdAt: new Date('2024-01-03')
  },
  {
    id: '5',
    referralCode: 'JOHN2024',
    referredEmail: 'lisa.anderson@email.com',
    referredName: 'Lisa Anderson',
    status: 'pending',
    rewardPoints: 0,
    createdAt: new Date('2023-12-28')
  },
  {
    id: '6',
    referralCode: 'JOHN2024',
    referredEmail: 'john.martinez@email.com',
    referredName: 'John Martinez',
    status: 'pending',
    rewardPoints: 0,
    createdAt: new Date('2023-12-25')
  },
  {
    id: '7',
    referralCode: 'JOHN2024',
    referredEmail: 'rachel.taylor@email.com',
    referredName: 'Rachel Taylor',
    status: 'pending',
    rewardPoints: 0,
    createdAt: new Date('2023-12-20')
  },
  {
    id: '8',
    referralCode: 'JOHN2024',
    referredEmail: 'alex.thomas@email.com',
    referredName: 'Alex Thomas',
    status: 'completed',
    rewardPoints: 500,
    createdAt: new Date('2023-11-15'),
    completedAt: new Date('2023-11-25')
  }
];

const shareOptions = [
  {
    name: 'Copy Link',
    icon: Copy,
    action: 'copy'
  },
  {
    name: 'Email',
    icon: Mail,
    action: 'email'
  },
  {
    name: 'Facebook',
    icon: MessageSquare,
    action: 'facebook'
  },
  {
    name: 'Twitter',
    icon: MessageSquare,
    action: 'twitter'
  }
];

const emailTemplates = [
  {
    id: 'personal',
    name: 'Personal Message',
    subject: 'Join me at Minsah Beauty!',
    body: `Hi there!

I wanted to share this amazing beauty brand with you - Minsah Beauty. They have incredible toxin-free skincare and makeup products that I absolutely love.

Use my referral code {referralCode} to get a special welcome bonus when you sign up!

Check them out here: {referralLink}

Best regards,
{senderName}`
  },
  {
    id: 'casual',
    name: 'Casual Invite',
    subject: 'You\'ve got to check this out!',
    body: `Hey!

Found this awesome beauty store called Minsah Beauty and thought you'd love it. Amazing products, great prices, and they're all about clean beauty.

Use my code {referralCode} for a discount on your first order. Here's the link: {referralLink}

Enjoy! ✨`
  }
];

export default function ReferralsPage() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const getStatusIcon = (status: Referral['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleSolid className="w-5 h-5 text-green-500" />;
      case 'made_purchase':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'signed_up':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: Referral['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'made_purchase':
        return 'Purchase Made';
      case 'signed_up':
        return 'Signed Up';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status: Referral['status']) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'made_purchase':
        return 'blue';
      case 'signed_up':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockReferralData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (action: string) => {
    switch (action) {
      case 'copy':
        handleCopyLink();
        break;
      case 'email':
        setShowEmailModal(true);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mockReferralData.referralLink)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out Minsah Beauty! Use my code ${mockReferralData.referralCode} for a special discount.`)}&url=${encodeURIComponent(mockReferralData.referralLink)}`, '_blank');
        break;
    }
  };

  const sendReferralEmail = () => {
    // In a real app, this would send an email
    console.log('Sending referral email to:', recipientEmail);
    console.log('Message:', customMessage || selectedTemplate.body);
    setShowEmailModal(false);
    setRecipientEmail('');
    setCustomMessage('');
  };

  const formatPoints = (points: number) => {
    return points.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Program</h1>
          <p className="text-gray-600">Share the love and earn rewards</p>
        </div>

        {/* Referral Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{mockReferralData.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircleSolid className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{mockReferralData.successfulReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">{formatPoints(mockReferralData.totalEarned)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{mockReferralData.pendingReferrals}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Share Your Code */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Share Your Referral Code</h2>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Your referral code</p>
                    <p className="text-3xl font-bold text-purple-600">{mockReferralData.referralCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-2">Your referral link</p>
                    <p className="text-xs text-gray-500 max-w-xs break-all">{mockReferralData.referralLink}</p>
                  </div>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition"
                >
                  {copied ? (
                    <>
                      <CheckCircleSolid className="w-5 h-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy Referral Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Share Options */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Share via</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {shareOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => handleShare(option.action)}
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition"
                    >
                      <option.icon className="w-6 h-6 text-gray-600 mb-2" />
                      <span className="text-sm text-gray-700">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Referral History */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Referral History</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {mockReferrals.map((referral) => (
                  <div key={referral.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(referral.status)}
                        <div>
                          <h3 className="font-medium text-gray-900">{referral.referredName}</h3>
                          <p className="text-sm text-gray-600">{referral.referredEmail}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-600">
                              Referred: {referral.createdAt.toLocaleDateString()}
                            </span>
                            {referral.completedAt && (
                              <span className="text-sm text-gray-600">
                                Completed: {referral.completedAt.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(referral.status)}-100 text-${getStatusColor(referral.status)}-800`}>
                          {getStatusLabel(referral.status)}
                        </span>
                        {referral.rewardPoints > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-green-600">
                              +{formatPoints(referral.rewardPoints)} points
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Share</h4>
                    <p className="text-sm text-gray-600">Share your code or link with friends</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">They Sign Up</h4>
                    <p className="text-sm text-gray-600">Friends create an account using your code</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">You Earn</h4>
                    <p className="text-sm text-gray-600">Get {formatPoints(mockReferralData.rewards.signupBonus)} points for signup</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Bonus!</h4>
                    <p className="text-sm text-gray-600">Get {formatPoints(mockReferralData.rewards.purchaseBonus)} more when they make a purchase</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rewards Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Rewards</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Signup Bonus</span>
                  <span className="font-medium text-gray-900">{formatPoints(mockReferralData.rewards.signupBonus)} pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Purchase Bonus</span>
                  <span className="font-medium text-gray-900">{formatPoints(mockReferralData.rewards.purchaseBonus)} pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Earned</span>
                  <span className="font-medium text-green-600">{formatPoints(mockReferralData.totalEarned)} pts</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Potential Earnings</span>
                    <span className="font-medium text-purple-600">{formatPoints(mockReferralData.rewards.totalPotential)} pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Share on social media for better visibility
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Personalize your message for better conversion
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Follow up with friends who showed interest
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Track your referrals to see who needs encouragement
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Send Referral Email</h3>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Recipient Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Template
                  </label>
                  <select
                    value={selectedTemplate.id}
                    onChange={(e) => {
                      const template = emailTemplates.find(t => t.id === e.target.value);
                      if (template) {
                        setSelectedTemplate(template);
                        setCustomMessage('');
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {emailTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={selectedTemplate.subject}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={customMessage || selectedTemplate.body}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap">
                    {(customMessage || selectedTemplate.body)
                      .replace('{referralCode}', mockReferralData.referralCode)
                      .replace('{referralLink}', mockReferralData.referralLink)
                      .replace('{senderName}', 'John Doe')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendReferralEmail}
                    disabled={!recipientEmail}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
