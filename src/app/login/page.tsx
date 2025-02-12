'use client';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Header from '@/components/Header';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error);
        return;
      }
      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
        if (localStorage.getItem('pendingCartItem')) {
          const cartItem = JSON.parse(
            localStorage.getItem('pendingCartItem') ?? ''
          );
          console.log('cartItem', cartItem);
          const cartResponse = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify(cartItem),
          });
          if (!cartResponse.ok) {
            toast.error('Failed to add item');
          } else if (cartResponse) {
            toast.success('Item added to cart');
            localStorage.removeItem('pendingCartItem');
          }
        }
        router.push('/product-listing');
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Login failed:', error);
    }
  };

  return (
    <>
      <div className='item-center'>
        <Header />
      </div>
      <div className='flex justify-center items-center min-h-screen  px-4 md:px-6'>
        <div className='w-full md:w-1/2 flex justify-center'>
          <Image
            src='/truck.png'
            alt='Lync Express 3D Truck'
            width={480}
            height={480}
            className='w-[280px] md:w-[420px] lg:w-[480px] object-contain'
            unoptimized
          />
        </div>

        <div className='w-full md:w-1/2 flex flex-col justify-center items-center'>
          <div className='w-full max-w-md bg-white bg-opacity-80 backdrop-blur-xl rounded-xl shadow-lg p-6 md:p-10'>
            <h2 className='text-2xl md:text-3xl font- font-bold text-gray-900 text-left'>
              Welcome To Lync Express
            </h2>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className='mt-6'>
                    <label className='block text-gray-800 text-sm font-semibold'>
                      Email ID <span className='text-red-500'>*</span>
                    </label>
                    <Field
                      type='email'
                      name='email'
                      className='w-full p-3 border border-gray-300 rounded-lg'
                      placeholder='example@email.com'
                    />
                    <ErrorMessage
                      name='email'
                      component='div'
                      className='text-red-500 text-sm mt-1'
                    />
                  </div>

                  <div className='mt-6'>
                    <label className='block text-gray-800 text-sm font-semibold'>
                      Password <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        className='w-full p-3 pr-10 border border-gray-300 rounded-lg'
                        placeholder='Enter your password'
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-3 text-gray-500'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name='password'
                      component='div'
                      className='text-red-500 text-sm mt-1'
                    />
                  </div>

                  <button
                    type='submit'
                    className='w-full md:w-36 mt-6 bg-yellow-500 text-white py-3 rounded-lg text-lg font-semibold'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}
