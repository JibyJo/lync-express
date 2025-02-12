import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Products';
import { verifyToken } from '@/utils/auth';

export interface DecodedToken {
  userId: string;
  email?: string;
}
export interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  orderDate: Date;
}
export interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  quantity: number;
  priceAtPurchase: number;
  totalItemPrice: number;
}
export async function GET(req: NextRequest) {
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
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.orders || user.orders.length === 0) {
      return NextResponse.json({ message: 'No orders found', orders: [] });
    }

    const productIds = user.orders.flatMap((order: Order) =>
      order.items.map((item: OrderItem) => item.productId)
    );

    const products = await Product.find({ _id: { $in: productIds } });

    const orders = user.orders.map((order: Order) => ({
      orderId: order._id,
      items: order.items
        .map((item) => {
          const product = products.find(
            (p) => p._id.toString() === item.productId.toString()
          );

          return product
            ? {
                productId: product._id,
                name: product.name,
                imageUrl: product.imageUrl || '',
                priceAtPurchase: item.priceAtPurchase,
                quantity: item.quantity,
                totalItemPrice: item.quantity * item.priceAtPurchase,
              }
            : null;
        })
        .filter(Boolean),
      totalAmount: order.totalAmount,
      status: order.status,
      orderDate: order.orderDate,
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: error },
      { status: 500 }
    );
  }
}
