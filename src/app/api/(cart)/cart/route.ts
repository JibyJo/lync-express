import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Products';
import { DecodedToken } from '../order-listing/route';
import { CartItem } from '../place-order/route';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your_secret_key';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No Token' },
        { status: 401 }
      );
    }

    const decoded: DecodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Missing productId or quantity' },
        { status: 400 }
      );
    }

    const existingCartItem = user.cart.find(
      (item: CartItem) =>
        item.productId && item.productId.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    user.set('cart', user.cart);
    await user.save();

    const updatedUser = await User.findById(decoded.userId)
      .populate({
        path: 'cart.productId',
        model: Product,
      })
      .exec();

    return NextResponse.json(
      { message: 'Cart updated successfully', cart: updatedUser.cart },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: error },
      { status: 500 }
    );
  }
}
