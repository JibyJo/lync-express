import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ToastProvider from '@/components/ToastProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Lync Express',
  description: 'A courier app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-no-repeat bg-cover bg-center`}
        style={{
          backgroundImage:
            "url('https://lyncexpress.in/assets/images/background.png')",
        }}
      >
        <ToastProvider />
        <div className='grid grid-cols-1 p-10'>
          <div className='border rounded-3xl shadow-lg         '>
            <div className='grid grid-cols-1 item-center px-6 py-20'>
              <div className=''>{children}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
