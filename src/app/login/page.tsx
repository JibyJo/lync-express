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
      if (data?.token) {
        localStorage.setItem('authToken', data.token);

        if (localStorage.getItem('pendingCartItem')) {
          const cartItem = JSON.parse(
            localStorage.getItem('pendingCartItem') ?? ''
          );

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
          } else {
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
      <Header />
      <div className='flex flex-col lg:flex-row justify-center items-center min-h-screen px-4 md:px-8'>
        {/* Left Section (Image) */}
        <div className='w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0'>
          <Image
            src='/truck.png'
            alt='Lync Express 3D Truck'
            width={480}
            height={480}
            className='w-[80%] max-w-[400px] md:max-w-[480px] object-contain'
            unoptimized
          />
        </div>

        {/* Right Section (Form) */}
        <div className='w-full lg:w-1/2 flex justify-center'>
          <div className='w-full max-w-md bg-white bg-opacity-80 backdrop-blur-xl rounded-xl shadow-lg p-6 md:p-10'>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 text-left'>
              Welcome To Lync Express
            </h2>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  {/* Email Input */}
                  <div className='mt-6'>
                    <label className='block text-gray-800 text-sm font-semibold'>
                      Email ID <span className='text-red-500'>*</span>
                    </label>
                    <Field
                      type='email'
                      name='email'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none text-gray-600 focus:ring-2 focus:ring-yellow-400'
                      placeholder='Type in your email'
                    />
                    <ErrorMessage
                      name='email'
                      component='div'
                      className='text-red-500 text-sm mt-1'
                    />
                  </div>

                  {/* Password Input */}
                  <div className='mt-6'>
                    <label className='block text-gray-800 text-sm font-semibold'>
                      Password <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        className='w-full p-3 pr-10 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400'
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

                  {/* Submit Button */}
                  <button
                    type='submit'
                    className='w-full md:w-40 mt-6 bg-yellow-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition'
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
