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
      toast.error('Some error occurred');
    }
  };

  if (!product) return <p className='text-center mt-10'>Loading...</p>;

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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 pt-20 px-6'>
        <div className='flex justify-center'>
          <div className='relative w-full max-w-[600px] h-full md:h-[500px] rounded-lg overflow-hidden'>
            <Image
              src={product.image_url ?? '/logo.png'}
              alt={product.name}
              width={600}
              height={500}
              className='w-full h-full object-cover rounded-lg'
            />
          </div>
        </div>

        <div className='flex flex-col justify-between h-full md:h-[500px]'>
          <div className='flex items-center space-x-2 text-yellow-500 font-semibold'>
            <span>{getStarIcons(product.rating)}</span>
            <span className='text-gray-600 text-sm sm:text-base'>
              {product.rating} Star Rating
            </span>
          </div>

          <h1 className='text-gray-900 font-poppins font-normal text-xl sm:text-2xl leading-6 tracking-normal underline'>
            {product.name}
          </h1>

          <div className='grid grid-cols-2 gap-x-8 gap-y-2 text-gray-700 underline text-sm sm:text-base'>
            <div className='flex items-center gap-1  pb-1'>
              <strong className='whitespace-nowrap text-[#5F6C72]'>Sku:</strong>
              <span className='text-black font-semibold'>{product.sku}</span>
            </div>
            <div className='flex items-center gap-1  pb-1'>
              <strong className='whitespace-nowrap text-[#5F6C72]'>
                Brand:
              </strong>
              <span className='text-black font-semibold'>{product.brand}</span>
            </div>

            <div className='flex items-center gap-1  pb-1'>
              <strong className='whitespace-nowrap text-[#5F6C72]'>
                Availability:
              </strong>
              <span className='text-green-600 font-semibold'>
                {product.availability}
              </span>
            </div>
            <div className='flex items-center gap-1  pb-1'>
              <strong className='whitespace-nowrap text-[#5F6C72]'>
                Category:
              </strong>
              <span className='text-black font-semibold'>
                {product.category}
              </span>
            </div>
          </div>

          <p className='text-2xl sm:text-3xl font-normal text-blue-600'>
            ₹{product.price}
          </p>

          <div className='flex items-center justify-between w-full max-w-[200px] border-2 border-gray-300 rounded-lg px-4 py-2'>
            <button
              className='text-lg font-bold text-gray-700'
              disabled={quantity === 1}
              onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
            >
              <MinusOutlined />
            </button>

            <span className='text-lg font-semibold text-gray-700'>
              {quantity < 10 ? `0${quantity}` : quantity}
            </span>

            <button
              className='text-lg font-bold text-gray-700'
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <PlusOutlined />
            </button>
          </div>

          <div className='w-full'>
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
