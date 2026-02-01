import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock user storage - replace with database
const mockUsers = [
  {
    id: 'admin_1',
    email: 'admin@minsah.com',
    password: 'admin123', // In production: hashed password
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active'
  },
  {
    id: 'user_1',
    email: 'user@test.com',
    password: 'user123', // In production: hashed password
    firstName: 'Test',
    lastName: 'User',
    role: 'customer',
    status: 'active'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in mock storage
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password (in production, compare with hashed password)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token (in production, use proper JWT library)
    const token = generateToken(user);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    });

    // Set authentication cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Set user ID cookie
    response.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
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
