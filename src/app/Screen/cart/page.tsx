"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return; // Giới hạn số lượng tối thiểu
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });

    const updated = items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setItems(updated);
  };

  const removeItem = async (productId: string) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setItems(items.filter((item) => item.productId !== productId));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: items }),
      });

      if (!res.ok) throw new Error("Không thể tạo đơn hàng");

      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: items }),
      });

      router.push("/successPage");
    } catch (error) {
      alert("❌ Có lỗi xảy ra khi đặt hàng");
      console.error("Checkout error:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );

  return (
    <div
      className="min-h-screen py-10 px-6"
      style={{
        background:
          "linear-gradient(135deg, #FFFFFF 0%, #DBEAFE 100%)", // gradient trắng - xanh dương nhạt
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        {/* Nút quay lại */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
          aria-label="Quay lại trang trước"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <h1 className="text-3xl font-bold mb-8 text-blue-700 flex items-center gap-2">
          🛒 Giỏ hàng
        </h1>

        {items.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="mb-4 text-lg">Giỏ hàng của bạn đang trống.</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
            >
              Quay lại trang sản phẩm
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-5">
                    <img
                      src={item.image || "/uploads/cute.jpg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <h2 className="font-semibold text-lg text-gray-800 truncate max-w-xs">
                        {item.name}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Giá: {item.price.toLocaleString()}₫
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Tổng: {(item.price * item.quantity).toLocaleString()}₫
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.productId, Number(e.target.value))
                      }
                      className="w-20 border border-gray-300 rounded px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-800 font-semibold transition"
                      aria-label={`Xóa sản phẩm ${item.name} khỏi giỏ hàng`}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right mt-8">
              <p className="text-2xl font-bold text-green-700">
                Tổng cộng: {total.toLocaleString()}₫
              </p>
              <button
                onClick={handleCheckout}
                className="mt-4 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg transition"
              >
                Tiến hành đặt hàng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
