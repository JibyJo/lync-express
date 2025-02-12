'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  orderDate: string;
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/order-listing', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.error) {
        console.log('Error fetching orders:', data.error);
      } else {
        setOrders(data.orders);
      }
    }

    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return <p className='text-center mt-10 text-gray-700'>No orders found.</p>;
  }

  return (
    <>
      <div className='item-center'>
        <Header />
      </div>

      <div className='min-h-screen  text-gray-600 p-10'>
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Order History</h2>

          {orders.map((order) => (
            <div key={order.orderId} className='border-b py-4'>
              <p className='text-lg font-semibold'>
                Order ID: <span className='text-gray-600'>{order.orderId}</span>
              </p>
              <p className='text-gray-700'>Status: {order.status}</p>
              <p className='text-gray-700'>
                Order Date: {new Date(order.orderDate).toLocaleDateString()}
              </p>

              <table className='w-full mt-4 text-left'>
                <thead>
                  <tr className='border-b'>
                    <th className='py-2'>Products</th>
                    <th className='py-2'>Price</th>
                    <th className='py-2'>Quantity</th>
                    <th className='py-2'>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.productId} className='border-b'>
                      <td className='py-3 flex items-center space-x-4'>
                        <Image
                          src={
                            item.imageUrl?.length > 0
                              ? item.imageUrl
                              : '/logo.png'
                          }
                          priority
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span>{item.name}</span>
                      </td>
                      <td className='py-3'>₹{item.priceAtPurchase}</td>
                      <td className='py-3'>{item.quantity}</td>
                      <td className='py-3 font-bold'>
                        ₹{item.priceAtPurchase * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className='mt-2 font-bold'>
                Total Amount: ₹{order.totalAmount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
