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
  const token = localStorage.getItem('authToken') ?? null;
  const [isSignedIn, setIsSignedIn] = useState<boolean>();
  useEffect(() => {
    setIsSignedIn(token ? true : false);
  }, []);
  const router = useRouter();
  const goToCart = () => {
    if (!isSignedIn) {
      toast.info('Please login to contine to cart');
    } else {
      setTimeout(() => {
        router.push('/cart-list');
      }, 500);
      console.log('not');
    }
  };
  const handleLogin = () => {
    console.log('s', token);

    if (isSignedIn) {
      console.log('token', token);
      localStorage.clear();
      setIsSignedIn(false);
      router.push('/');
    } else {
      setTimeout(() => {
        router.push('/login');
      }, 500);
    }
  };
  return (
    <div className='flex justify-between items-center h-[64px] bg-white rounded-[32px] shadow-md px-6 mt-[0px]'>
      <div className='flex items-center gap-3' onClick={() => router.push('/')}>
        <Image
          priority
          src='/logo.png'
          alt='Lync Express Logo'
          width={60}
          height={51}
          className='object-contain'
        />
        <span className='text-[32px] font-normal leading-[48px] text-[#ECC75D] font-poppins'>
          Lync <span className='text-[#EE5858]'>Express</span>
        </span>
      </div>

      <div className='flex z-30 items-center gap-5 text-[#ECC75D] text-[32px] cursor-pointer'>
        {isSignedIn ? (
          <LogoutOutlined
            onClick={() => handleLogin()}
            className='hover:text-yellow-500 transition'
          />
        ) : (
          <LoginOutlined onClick={() => handleLogin()} />
        )}
        <ShoppingCartOutlined
          onClick={goToCart}
          className='hover:text-yellow-500 transition'
        />
      </div>
    </div>
  );
}
