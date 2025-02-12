'use client';
import Header from '@/components/Header';
import { CheckCircleTwoTone } from '@ant-design/icons';
import Link from 'next/link';

export default function OrderSuccess() {
  return (
    <>
      <div className='item-center'>
        <Header />
      </div>

      <div>
        <div className='text-center'>
          <div className='flex justify-center'>
            <div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center'>
              <CheckCircleTwoTone />
            </div>
          </div>
          <h2 className='text-xl font-bold mt-4 text-gray-800'>
            Your order is successfully placed
          </h2>
          <p className='text-gray-600 mt-2'>
            Pellentesque sed lectus nec tortor tristique accumsan quis dictum
            risus. Donec volutpat molestie nulla non facilisis.
          </p>
        </div>

        <div className='mt-6 flex justify-center space-x-4'>
          <Link href='/'>
            <button className='px-6 py-2 border border-yellow-500 text-yellow-500 rounded-full hover:bg-yellow-100'>
              GO TO DASHBOARD
            </button>
          </Link>
          <Link href={'/order-listing'}>
            <button className='px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600'>
              VIEW ORDERS →
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
