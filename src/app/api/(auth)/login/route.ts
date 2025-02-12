import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET ?? '';
export async function POST(req: Request) {
  await connectToDatabase();

  const { email, password } = await req.json();

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  }

  const isMatchAsync = await bcrypt.compare(password, user.password);

  if (!isMatchAsync) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return NextResponse.json({ token }, { status: 200 });
}
