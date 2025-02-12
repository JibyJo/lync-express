import { NextRequest, NextResponse } from 'next/server';

import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';

export async function middleware(req: NextRequest) {
  const urlPath = req.nextUrl.pathname;
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;
  const protectedRoutes = [
    '/api/cart',
    '/api/cart-listing',
    '/api/cart-remove',
    '/api/order-listing',
    '/api/place-order',
  ];
  const protectedPageRoutes = ['/cart-list', '/orders', 'order-listing'];

  if (protectedPageRoutes.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (protectedRoutes.includes(urlPath)) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No Token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      req.headers.set('user', JSON.stringify(decoded));
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid Token', details: error },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}
