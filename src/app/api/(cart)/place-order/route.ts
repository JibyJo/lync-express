import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';
import { DecodedToken } from '../order-listing/route';
import { verifyToken } from '@/utils/auth';

export interface CartItem {
  item: number;
  productId: { _id: string; price: number };
  quantity: number;
  subTotal: number;
}
export interface Order {
  items: CartItem[];
  totalAmount: number;
  status: string;
  orderDate: Date;
}
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

    const decoded: DecodedToken = verifyToken(token) as DecodedToken;
    const user = await User.findById(decoded.userId).populate('cart.productId');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.cart || user.cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const orderItems = user.cart
      .map((item: CartItem) => {
        if (!item.productId || !item.productId._id) {
          return null;
        }

        return {
          productId: item.productId._id,
          quantity: item.quantity,
          priceAtPurchase: item.productId.price,
        };
      })
      .filter(Boolean);

    const totalAmount = orderItems.reduce(
      (sum: number, item: { priceAtPurchase: number; quantity: number }) =>
        sum + item.priceAtPurchase * item.quantity,
      0
    );

    user.orders.push({
      items: orderItems,
      totalAmount,
      status: 'Pending',
      orderDate: new Date(),
    });

    user.cart = [];
    await user.save();

    return NextResponse.json(
      { message: 'Order placed successfully', order: user.orders },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: error },
      { status: 500 }
    );
  }
}
