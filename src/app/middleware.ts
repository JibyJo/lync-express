import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET ?? '';

const protectedRoutes = ['/api/cart', '/api/orders'];

export function middleware(req: NextRequest) {
  const urlPath = req.nextUrl.pathname;

  if (protectedRoutes.includes(urlPath)) {
    console.log('include');
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No Token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
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
