import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock user storage - in production, use database
const mockUsers = new Map<string, any>();

// Add some mock users for testing
mockUsers.set('user@test.com', {
  id: 'user_1',
  email: 'user@test.com',
  password: 'oldpassword123',
  firstName: 'Test',
  lastName: 'User',
  role: 'customer'
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, oldPassword, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Verify reset token
    let tokenData;
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      tokenData = JSON.parse(decoded);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 401 }
      );
    }

    // Check token expiration
    if (Date.now() > tokenData.exp) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 401 }
      );
    }

    // Check token purpose
    if (tokenData.purpose !== 'password_reset') {
      return NextResponse.json(
        { error: 'Invalid token purpose' },
        { status: 401 }
      );
    }

    // Find user by email from token
    const user = mockUsers.get(tokenData.email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If old password is provided, verify it
    if (oldPassword && user.password !== oldPassword) {
      return NextResponse.json(
        { error: 'Old password is incorrect' },
        { status: 401 }
      );
    }

    // Update password (in production, hash with bcrypt)
    user.password = newPassword;
    mockUsers.set(tokenData.email, user);

    return NextResponse.json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
