import { NextResponse } from 'next/server';
import User from '@/models/User';
import { verifyToken } from '@/utils/auth';
import { DecodedToken } from '../order-listing/route';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: DecodedToken = verifyToken(token) as DecodedToken;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.cart = user.cart.filter(
      (item: any) => item.productId.toString() !== productId
    );
    await user.save();

    return NextResponse.json({ cart: user.cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
