import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Products';
import { DecodedToken } from '../order-listing/route';
import { CartItem } from '../place-order/route';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET ?? '';

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

    const decoded: DecodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.cart || user.cart.length === 0) {
      return NextResponse.json({
        message: 'Cart is empty',
        cart: [],
        totals: {},
      });
    }

    const productIds = user.cart
      .map((item: CartItem) => item.productId)
      .filter((id: string) => id);

    if (productIds.length === 0) {
      return NextResponse.json({ cart: [], totals: {} });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = user.cart
      .map((item: CartItem) => {
        const product = products.find(
          (p) => p._id.toString() === item.productId?.toString()
        );

        if (!product) {
          console.warn(`⚠️ Product not found for ID: ${item.productId}`);
          return null;
        }

        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product?._doc?.image_url ?? product.image_url,
          rating: product.rating,
          availability: product.availability,
          quantity: item.quantity,
          sizeOptions: product?._doc?.size_options ?? product.size_options,
          sku: product.sku,
          brand: product.brand,
          category: product.category,
          subTotal: product.price * item.quantity,
        };
      })
      .filter(Boolean);

    const subtotal = cartItems.reduce(
      (sum: number, item: CartItem) => sum + (item?.subTotal || 0),
      0
    );

    const discount = subtotal > 2500 ? Math.floor(subtotal * 0.05) : 0;

    const tax = Math.floor(subtotal * 0.1);

    const total = subtotal - discount + tax;

    return NextResponse.json({
      cart: cartItems,
      totals: {
        subtotal,
        discount,
        tax,
        total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: error },
      { status: 500 }
    );
  }
}
