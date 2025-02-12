'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  StarFilled,
  StarOutlined,
  StarTwoTone,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
export type Product = {
  _id: string;
  name: string;
  price: number;
  rating: number;
  sku: string;
  brand: string;
  category: string;
  availability: string;
  image_url: string;
  imageUrl: string;
  badge: string;
};
export default function ProductPage() {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/product-detail/${id}`);
      console.log('res', res);
      const data = await res.json();
      setProduct(data);
    }

    fetchProduct();
    setIsAuthenticated(!!localStorage.getItem('authToken'));
  }, [id]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (!isAuthenticated) {
      toast.info('Please login to add item(s)');
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    console.log('clicked', quantity);
    try {
      if (!isAuthenticated) {
        localStorage.setItem(
          'pendingCartItem',
          JSON.stringify({ productId: product?._id, quantity })
        );
        router.push('/login');
      } else {
        await handleQuantityChange(quantity);
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({
            productId: product?._id,
            quantity: quantity,
          }),
        });
        if (response) {
          toast.success(`${quantity} Item(s) added to cart!`);
          setQuantity(1);
        }
      }
    } catch (e) {
      console.log('e', e);
      toast.error('Some error occured');
    }
  };
  if (!product) return <p>Loading...</p>;
  const getStarIcons = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className='flex items-center text-yellow-500'>
        {[...Array(fullStars)].map((_, i) => (
          <StarFilled key={`full-${i}`} style={{ color: '#FA8232' }} />
        ))}

        {hasHalfStar && (
          <StarTwoTone key='half' twoToneColor={['#FA8232', '#E5E5E5']} />
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <StarOutlined key={`empty-${i}`} style={{ color: '#E5E5E5' }} />
        ))}
      </span>
    );
  };
  return (
    <>
      <div className='item-center'>
        <Header />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 pt-40'>
        <div className='relative flex justify-center w-[600px] h-[638px]  rounded-lg'>
          <Image
            src={product.image_url ?? '/logo.png'}
            alt={product.name}
            width={600}
            height={638}
            className='absolute w-full h-full object-contain rounded-lg'
          />
        </div>

        <div className='space-y-4 z-20'>
          <div className='flex items-center space-x-2 text-yellow-500 font-semibold'>
            <span>{getStarIcons(product.rating)}</span>
            <span className='text-gray-600'>{product.rating} Star Rating</span>
          </div>
          <span className='text-gray-900 font-poppins font-normal text-[22px] leading-[20px] tracking-normal underline underline-offset-auto decoration-solid decoration-auto decoration-skip-ink-auto'>
            {product.name}
          </span>

          <p className='text-gray-600 underline'>
            <strong>Sku:</strong>{' '}
            <span className='text-blue-600'>{product.sku}</span> <br />
            <strong>Brand:</strong>{' '}
            <span className='text-black font-semibold'>{product.brand}</span>{' '}
            <br />
            <strong>Availability:</strong>{' '}
            <span className='text-green-600 font-semibold'>
              {product.availability}
            </span>{' '}
            <br />
            <strong>Category:</strong>{' '}
            <span className='text-black font-semibold'>{product.category}</span>
          </p>

          <p className='text-3xl font-bold text-blue-600'>₹{product.price}</p>

          <div className='flex flex-row justify-between items-center px-5 py-4 gap-6 w-[164px] h-[56px] bg-white border-2 border-[#E4E7E9] rounded-[16px]'>
            <button
              className='text-lg font-bold text-gray-700'
              disabled={quantity == 1}
              onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
            >
              <MinusOutlined disabled={quantity == 1} />
            </button>

            <span className='text-lg font-semibold text-gray-700 underline'>
              {quantity < 10 ? `0${quantity}` : quantity}
            </span>

            <button
              className='text-lg font-bold text-gray-700'
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <PlusOutlined />
            </button>
          </div>

          <div className='flex flex-row items-start px-0 pt-3 gap-4 w-[310px] h-[68px]'>
            <button
              onClick={handleAddToCart}
              className='w-full md:w-auto bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition underline'
            >
              ADD TO CART <ShoppingCartOutlined />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
