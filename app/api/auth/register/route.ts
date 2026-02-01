import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock user storage - replace with database
const mockUsers = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, password, dateOfBirth, gender } = body;

    // Split name into firstName and lastName if provided as single field
    let firstName = '';
    let lastName = '';

    if (name) {
      const nameParts = name.trim().split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ') || nameParts[0];
    }

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = Array.from(mockUsers.values()).find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Create new user (in production, hash password with bcrypt)
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      firstName,
      lastName,
      phone: phone || null,
      password, // In production: await bcrypt.hash(password, 10),
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      avatar: null,
      emailVerified: false,
      phoneVerified: false,
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      preferences: {
        newsletter: true,
        smsNotifications: false,
        promotions: true,
        newProducts: true,
        orderUpdates: true
      },
      addresses: [],
      loyaltyPoints: 100, // Welcome bonus
      referralCode: generateReferralCode(),
      referredBy: null
    };

    // Save user
    mockUsers.set(newUser.id, newUser);

    // Create user profile
    const userProfile = {
      userId: newUser.id,
      bio: null,
      website: null,
      socialLinks: {},
      preferences: {
        language: 'en',
        currency: 'BDT',
        newsletter: true,
        smsNotifications: false,
        pushNotifications: true,
        emailNotifications: true,
        marketingEmails: true
      }
    };

    // Generate JWT token (in production, use proper JWT library)
    const token = generateToken(newUser);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    const response = NextResponse.json({
      user: userWithoutPassword,
      profile: userProfile,
      token,
      message: 'Registration successful'
    }, { status: 201 });

    // Set authentication cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Set user ID cookie
    response.cookies.set('user_id', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateToken(user: any): string {
  // In production, use proper JWT library like jsonwebtoken
  // This is a simplified mock token
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + (60 * 60 * 24 * 7) // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}
