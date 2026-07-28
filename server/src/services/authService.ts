import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { redis } from '../config/redis';

export interface RegisterDTO {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'teacher' | 'admin' | 'super_admin';
  department?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private generateTokens(user: IUser): Tokens {
    const payload = { userId: user._id, email: user.email, role: user.role };
    
    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
    
    const refreshTokenId = Math.random().toString(36).substring(2, 15);
    const refreshTokenPayload = { ...payload, tokenId: refreshTokenId };
    
    const refreshToken = jwt.sign(refreshTokenPayload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
    // Store in redis: refresh:${userId}:${tokenId}
    redis.set(`refresh:${user._id}:${refreshTokenId}`, 'valid', 'EX', 7 * 24 * 60 * 60);

    return { accessToken, refreshToken };
  }

  async register(data: RegisterDTO): Promise<{ user: IUser; tokens: Tokens }> {
    const user = new User(data);
    if (data.password) {
       const bcrypt = await import('bcryptjs');
       user.password = await bcrypt.hash(data.password, 10);
    }
    await user.save();
    const tokens = this.generateTokens(user);
    return { user, tokens };
  }

  async login(email: string, password: string): Promise<{ user: IUser; tokens: Tokens }> {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');

    const tokens = this.generateTokens(user);
    return { user, tokens };
  }

  async refreshToken(refreshTokenStr: string): Promise<Tokens> {
    try {
      const decoded = jwt.verify(refreshTokenStr, env.JWT_REFRESH_SECRET) as any;
      const { userId, tokenId } = decoded;
      
      const isValid = await redis.get(`refresh:${userId}:${tokenId}`);
      if (!isValid) throw new Error('Invalid refresh token');

      // Invalidate old token
      await redis.del(`refresh:${userId}:${tokenId}`);
      
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      return this.generateTokens(user);
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshTokenStr: string): Promise<void> {
     try {
       const decoded = jwt.verify(refreshTokenStr, env.JWT_REFRESH_SECRET) as any;
       const { tokenId } = decoded;
       await redis.del(`refresh:${userId}:${tokenId}`);
     } catch (err) {
       // Token might already be invalid, safe to ignore
     }
  }

  async forgotPassword(email: string): Promise<void> {
    // Implementation for forgot password
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Implementation for reset password
  }

  async verifyEmail(token: string): Promise<void> {
    // Implementation for verify email
  }

  async oauthLogin(provider: 'google' | 'github', code: string): Promise<{ user: IUser; tokens: Tokens }> {
    // Implementation for oauth login
    throw new Error('Not implemented');
  }
}

export const authService = new AuthService();
