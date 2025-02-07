'use client';
import Image from 'next/image';
import { useState } from 'react';
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Heroicons for the eye icon

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#E3FDFD] via-[#FFE6FA] to-[#D3C4F2] px-4'>
      {/* Top Navigation Bar */}
      <div className='w-full max-w-4xl bg-white bg-opacity-40 backdrop-blur-md rounded-[30px] p-3 px-6 shadow-md border border-white/50 flex items-center mt-6'>
        {/* Logo */}
        <div className='flex items-center space-x-3'>
          <div className='flex space-x-1'>
            <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
            <div className='w-3 h-3 bg-red-500 rounded-full'></div>
            <div className='w-3 h-3 bg-pink-500 rounded-full'></div>
          </div>
          <h2 className='text-xl font-semibold text-gray-800'>
            Lync <span className='text-red-500'>Express</span>
          </h2>
        </div>
      </div>

      {/* Login Card */}
      <div className='w-full max-w-4xl bg-white bg-opacity-40 backdrop-blur-lg rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center border border-white/50 mt-10'>
        {/* Left Side - SVG Image */}
        <div className='md:w-1/2 p-6 flex justify-center'>
          <Image
            src='https://agent.lyncexpress.in/assets/login-img-1IpUhuZI.svg'
            alt='Lync Express 3D Truck'
            width={350}
            height={350}
            unoptimized
          />
        </div>

        {/* Right Side - Form */}
        <div className='md:w-1/2 p-6'>
          <h2 className='text-2xl font-bold text-gray-800'>
            Welcome To Lync Express
          </h2>
          <p className='text-gray-600 text-sm mt-2'>
            Please enter the username and password received in your email
          </p>

          {/* Email Input */}
          <div className='mt-4'>
            <label className='block text-gray-700 text-sm font-semibold'>
              Email ID <span className='text-red-500'>*</span>
            </label>
            <input
              type='email'
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-400'
              placeholder='example@email.com'
            />
          </div>

          {/* Password Input */}
          <div className='mt-4'>
            <label className='block text-gray-700 text-sm font-semibold'>
              Password <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-400'
                placeholder='Password'
              />
              {/* Eye Icon for Password Visibility Toggle */}
              <button
                type='button'
                className='absolute right-3 top-3 text-gray-500'
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* {showPassword ? (
                  <EyeSlashIcon className='w-5 h-5' />
                ) : (
                  <EyeIcon className='w-5 h-5' />
                )} */}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button className='w-32 mt-6 bg-yellow-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-200'>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
