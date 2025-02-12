'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CloseCircleTwoTone } from '@ant-design/icons';
import Header from '@/components/Header';
import { toast } from 'react-toastify';
import Modal from '@/components/Modal';
import Link from 'next/link';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  subTotal: number;
}

interface CartData {
  cart: CartItem[];
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
}

export default function CartPage() {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const router = useRouter();

  async function fetchCart() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const res = await fetch('/api/cart-listing', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.error) {
      console.log('Error fetching cart:', data.error);
      router.push('/login');
    } else {
      if (data?.cart?.length === 0) {
        toast.info('Your cart is empty');
        router.push('/');
      }
      setCartData(data);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    console.log('quantity', quantity);
    const token = localStorage.getItem('authToken');
    await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    const res = await fetch('/api/cart-listing', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedCart = await res.json();
    setCartData(updatedCart);
  };
  const openModal = (productId: string) => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  const handleRemoveItem = async () => {
    if (!selectedProductId) return;

    const token = localStorage.getItem('authToken');
    await fetch('/api/cart-remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: selectedProductId }),
    });

    setShowModal(false);
    const res = await fetch('/api/cart-listing', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedCart = await res.json();
    setCartData(updatedCart);
  };
  const handleCheckout = async () => {
    const token = localStorage.getItem('authToken');
    const res = await fetch('/api/place-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data.error) {
      console.error('Checkout failed:', data.error);
    } else {
      router.push('/orders');
    }
  };

  return (
    <>
      <div className='item-center'>
        <Header />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleRemoveItem}
        title='Confirm Removal'
        description='Are you sure you want to remove this item from your cart?'
      />

      <div className='p-6 mt-20 text-[#191C1F] bg-gradient-to-b from-white/[0.3128] to-white/[0.4692] rounded-[12px] shadow-lg'>
        <div className='flex flex-row justify-between gap-8'>
          <div className='bg-white flex-1 p-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold mb-4'>Shopping Cart</h2>

            <table className='w-full border-collapse'>
              <thead>
                <tr className='border-b'>
                  <th className='py-3 text-left w-[40%]'>Products</th>
                  <th className='py-3 text-left w-[15%]'>Price</th>
                  <th className='py-3 text-center w-[20%]'>Quantity</th>
                  <th className='py-3 text-left w-[15%]'>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartData?.cart.map((item) => (
                  <tr key={item.productId} className='border-b'>
                    <td className='flex items-center gap-4 py-3 w-[40%]'>
                      <button
                        onClick={() => openModal(item.productId)}
                        className='text-red-500'
                      >
                        <CloseCircleTwoTone />
                      </button>
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={50}
                        height={50}
                        className='rounded'
                      />
                      <Link href={`/product-detail/${item.productId}`}>
                        <span className='text-sm underline text-[#191C1F]'>
                          {item.name}
                        </span>
                      </Link>
                    </td>

                    <td className='py-3 text-left w-[15%] text-gray-700'>
                      ₹{item.price}
                    </td>

                    <td className='py-3 text-center w-[20%]'>
                      <div className='flex items-center justify-center border border-[#E4E7E9] rounded-md px-2 py-1 w-fit mx-auto'>
                        <button
                          className='text-gray-500 px-2'
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              Math.max(1, -1)
                            )
                          }
                        >
                          -
                        </button>
                        <input
                          type='text'
                          value={item.quantity}
                          className='w-[40px] text-center bg-transparent outline-none'
                          readOnly
                        />
                        <button
                          className='text-gray-900 px-2'
                          onClick={() =>
                            handleQuantityChange(item.productId, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className='py-3 text-left w-[15%] font-bold text-[#191C1F]'>
                      ₹{item.subTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='bg-gray-100 rounded-lg p-6 w-[30%] h-fit shadow-md font-Poppins underline'>
            <h2 className='text-lg font-semibold mb-3 text-left'>
              Cart Totals
            </h2>

            <div className='space-y-2'>
              <div className='flex justify-between'>
                <p className='text-gray-700'>Subtotal:</p>
                <p className='text-gray-700 underline'>
                  ₹{cartData?.totals.subtotal}
                </p>
              </div>
              <div className='flex justify-between'>
                <p className='text-gray-700'>Discount:</p>
                <p className='text-gray-700 underline'>
                  ₹{cartData?.totals.discount}
                </p>
              </div>
              <div className='flex justify-between'>
                <p className='text-gray-700'>Tax:</p>
                <p className='text-gray-700 underline'>
                  ₹{cartData?.totals.tax}
                </p>
              </div>
              <div className='flex justify-between font-bold text-lg mt-2'>
                <p>Total:</p>
                <p className='underline'>₹{cartData?.totals.total}</p>
              </div>
            </div>

            <button
              className='bg-yellow-500 text-white py-3 px-6 rounded-lg mt-4 w-full'
              onClick={handleCheckout}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
