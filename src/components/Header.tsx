'use client';
import {
  LoginOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Header() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken') ?? null;
    setIsSignedIn(!!token);
  }, []);

  const goToCart = () => {
    if (!isSignedIn) {
      toast.info('Please login to continue to cart');
    } else {
      router.push('/cart-list');
    }
  };

  const handleLogin = () => {
    if (isSignedIn) {
      localStorage.removeItem('authToken'); // Only remove the token instead of clearing entire localStorage
      setIsSignedIn(false);
      router.push('/');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className='flex justify-between items-center w-full bg-white shadow-md px-6 py-3 rounded-xl md:rounded-[32px]'>
      <div
        className='flex items-center gap-3 cursor-pointer'
        onClick={() => router.push('/')}
      >
        <Image
          priority
          src='/logo.png'
          alt='Lync Express Logo'
          width={50}
          height={40}
          className='object-contain'
        />
        <span className='text-xl sm:text-2xl md:text-3xl font-semibold text-[#ECC75D] font-poppins'>
          Lync <span className='text-[#EE5858]'>Express</span>
        </span>
      </div>

      <div className='flex items-center gap-4 sm:gap-6 text-[#ECC75D] text-xl sm:text-2xl md:text-3xl cursor-pointer'>
        {isSignedIn ? (
          <LogoutOutlined
            onClick={handleLogin}
            className='hover:text-yellow-500 transition'
            title='Logout'
          />
        ) : (
          <LoginOutlined
            onClick={handleLogin}
            className='hover:text-yellow-500 transition'
            title='Login'
          />
        )}
        <ShoppingCartOutlined
          onClick={goToCart}
          className='hover:text-yellow-500 transition'
          title='Cart'
        />
      </div>
    </div>
  );
}
