import React from "react";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/context/CartContext"; 

interface CartModalProps {
  onClose: () => void;
}

export default function CartModal({ onClose }: CartModalProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
        <h2 className="text-2xl font-bold mb-4">🛒 Giỏ hàng của bạn</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Giỏ hàng đang trống.</p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {cartItems.map((item: CartItem) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-4 border-b pb-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-green-600">
                    {item.price.toLocaleString()}₫
                  </p>
                </div>
                <div>
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, Number(e.target.value))
                    }
                    className="border rounded p-1"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        SL: {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ❌ Xóa
                </button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <p className="text-xl font-semibold">
              Tổng cộng:{" "}
              <span className="text-green-600">{total.toLocaleString()}₫</span>
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  alert("✅ Thanh toán thành công!");
                  clearCart();
                  onClose();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                💰 Thanh toán
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
