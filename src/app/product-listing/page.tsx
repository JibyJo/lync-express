'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../product-detail/[id]/page';
import Header from '@/components/Header';

export default function ProductListing() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/product-listing');
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <>
      <div className='item-center'>
        <Header />
      </div>
      <div className='p-2 mt-12'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8'>
          {products.length > 0 ? (
            products.map((product: Product, index) => (
              <Link
                key={`product${product._id}${index}`}
                href={`/product-detail/${product._id}`}
              >
                <div
                  key={`product${product._id}${index}`}
                  className='bg-white shadow-md p-6 flex flex-col justify-between relative  overflow-hidden'
                >
                  {product.badge && (
                    <div
                      className='absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white '
                      style={{
                        backgroundColor:
                          product.badge === 'HOT' ? '#EF4444' : '#3B82F6',
                      }}
                    >
                      {product.badge}
                    </div>
                  )}
                  <div className='h-36 bg-gray-100 flex items-center justify-center relative'>
                    <Image
                      src={product.image_url ?? '/logo.png'}
                      alt={product.name}
                      width={124}
                      height={132}
                      className='w-full h-full object-cover'
                      priority
                    />
                  </div>

                  <div className='mt-4 text-yellow-400 text-sm'>
                    {'★'.repeat(5)}{' '}
                    <span className='text-gray-500'>({product.rating})</span>
                  </div>

                  <p className='text-sm text-gray-700 mt-2 h-[80px] font-poppins underline leading-tight'>
                    {product.name}
                  </p>

                  <p className='mt-3 text-lg font-bold text-blue-500'>
                    {product.price}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className='text-center col-span-5 text-gray-700 text-lg'>
              Loading products...
            </p>
          )}
        </div>
      </div>
    </>
  );
}
