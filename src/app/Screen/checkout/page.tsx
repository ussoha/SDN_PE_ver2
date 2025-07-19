"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState([]);

useEffect(() => {
  const fetchCart = async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data.products || []); // phải là `products`, giống với response API
  };

  fetchCart();
}, []);

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!session) {
      router.push("/authscreen/login");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({ cart }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      localStorage.removeItem("cart");
      router.push("/success");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Xác nhận đơn hàng</h1>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <>
          <ul className="divide-y">
            {cart.map((item: any, idx) => (
              <li key={idx} className="py-2 flex justify-between">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{(item.price * item.quantity).toLocaleString()}₫</span>
              </li>
            ))}
          </ul>
          <div className="text-right font-bold mt-4">
            Tổng cộng: {total.toLocaleString()}₫
          </div>
          <button
            onClick={handlePlaceOrder}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
          >
            Đặt hàng
          </button>
        </>
      )}
    </div>
  );
}
