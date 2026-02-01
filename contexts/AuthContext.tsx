'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import type { User, UserAddress, LoyaltyTransaction, Referral, ProductReview, WishlistItem, UserStats } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithProvider: (provider: string) => void;
  logout: () => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  isInRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in production, this would come from your API
const createMockUser = (): User => ({
  id: '1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1 (555) 123-4567',
  dateOfBirth: new Date('1990-05-15'),
  gender: 'male',
  avatar: '/avatars/john-doe.jpg',
  emailVerified: true,
  phoneVerified: false,
  role: 'customer',
  status: 'active',
  createdAt: new Date('2023-01-15'),
  lastLoginAt: new Date('2024-01-20'),
  preferences: {
    newsletter: true,
    smsNotifications: false,
    promotions: true,
    newProducts: true,
    orderUpdates: true
  },
  addresses: [],
  loyaltyPoints: 2450,
  referralCode: 'JOHN2024',
  referredBy: ''
});

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      // In production, you would fetch user data from your API
      const userData = createMockUser();
      userData.email = session.user.email || userData.email;
      setUser(userData);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [session, status]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, this would call your authentication API
      if (email === 'john.doe@example.com' && password === 'password') {
        const userData = createMockUser();
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithProvider = (provider: string) => {
    // This would trigger NextAuth.js provider login
    console.log(`Logging in with ${provider}`);
    // In production: signIn(provider);
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      // In production, this would call your logout API and NextAuth.js signOut
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, this would call your registration API
      const newUser: User = {
        ...createMockUser(),
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date(),
        emailVerified: false,
        role: 'customer'
      } as User;

      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      // In production, this would update the user in your database
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  const updatePreferences = async (preferences: Partial<User['preferences']>): Promise<boolean> => {
    if (!user) return false;

    try {
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences }
      };
      setUser(updatedUser);

      // In production, this would update preferences in your database
      return true;
    } catch (error) {
      console.error('Update preferences error:', error);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, this would call your password change API
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (user) {
        const avatarUrl = URL.createObjectURL(file);
        setUser({ ...user, avatar: avatarUrl });
      }

      // In production, this would upload to your file storage service
      return true;
    } catch (error) {
      console.error('Avatar upload error:', error);
      return false;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Check user role permissions
    const rolePermissions = {
      customer: [
        'browse_products',
        'view_products',
        'add_to_cart',
        'purchase_products',
        'write_reviews',
        'manage_profile',
        'manage_addresses',
        'manage_wishlist',
        'view_orders',
        'track_orders'
      ],
      vip: [
        'browse_products',
        'view_products',
        'add_to_cart',
        'purchase_products',
        'write_reviews',
        'manage_profile',
        'manage_addresses',
        'manage_wishlist',
        'view_orders',
        'track_orders',
        'exclusive_deals',
        'early_access',
        'free_shipping',
        'priority_support'
      ],
      premium: [
        'browse_products',
        'view_products',
        'add_to_cart',
        'purchase_products',
        'write_reviews',
        'manage_profile',
        'manage_addresses',
        'manage_wishlist',
        'view_orders',
        'track_orders',
        'exclusive_deals',
        'early_access',
        'free_shipping',
        'priority_support',
        'personal_stylist',
        'birthday_rewards',
        'anniversary_rewards'
      ]
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const isInRole = (role: string): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithProvider,
    logout,
    register,
    updateUser,
    updatePreferences,
    changePassword,
    uploadAvatar,
    hasPermission,
    isInRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderContent>
        {children}
      </AuthProviderContent>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Additional hooks for convenience
export function useUserPermissions() {
  const { hasPermission, isInRole, user } = useAuth();

  return {
    canBrowseProducts: hasPermission('browse_products'),
    canViewProducts: hasPermission('view_products'),
    canAddToCart: hasPermission('add_to_cart'),
    canPurchaseProducts: hasPermission('purchase_products'),
    canWriteReviews: hasPermission('write_reviews'),
    canManageProfile: hasPermission('manage_profile'),
    canManageAddresses: hasPermission('manage_addresses'),
    canManageWishlist: hasPermission('manage_wishlist'),
    canViewOrders: hasPermission('view_orders'),
    canTrackOrders: hasPermission('track_orders'),
    canAccessExclusiveDeals: hasPermission('exclusive_deals'),
    canGetEarlyAccess: hasPermission('early_access'),
    hasFreeShipping: hasPermission('free_shipping'),
    hasPrioritySupport: hasPermission('priority_support'),
    hasPersonalStylist: hasPermission('personal_stylist'),
    getsBirthdayRewards: hasPermission('birthday_rewards'),
    getsAnniversaryRewards: hasPermission('anniversary_rewards'),
    isVip: isInRole('vip'),
    isPremium: isInRole('premium'),
    isCustomer: isInRole('customer')
  };
}

export function useLoyaltyPoints() {
  const { user, updateUser } = useAuth();

  const addPoints = async (points: number, description: string) => {
    if (!user) return false;

    try {
      const newTotal = user.loyaltyPoints + points;
      await updateUser({ loyaltyPoints: newTotal });
      return true;
    } catch (error) {
      console.error('Add points error:', error);
      return false;
    }
  };

  const redeemPoints = async (points: number) => {
    if (!user || user.loyaltyPoints < points) return false;

    try {
      const newTotal = user.loyaltyPoints - points;
      await updateUser({ loyaltyPoints: newTotal });
      return true;
    } catch (error) {
      console.error('Redeem points error:', error);
      return false;
    }
  };

  return {
    currentPoints: user?.loyaltyPoints || 0,
    addPoints,
    redeemPoints,
    canRedeem: (points: number) => !!(user && user.loyaltyPoints >= points)
  };
}
