import { NextRequest, NextResponse } from 'next/server';

import { verifyToken } from '@/utils/auth';

const protectedRoutes = ['/api/cart', '/api/orders', '/orders'];

export function middleware(req: NextRequest) {
  const urlPath = req.nextUrl.pathname;

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
