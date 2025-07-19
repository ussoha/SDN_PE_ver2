"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Order {
  _id: string;
  totalAmount: number;
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: string;
  createdAt: string;
}

export default function OrderHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (status !== "authenticated" || !session) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/orders", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Lỗi HTTP: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }

        setOrders(data);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
        setError("Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status, session]);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #DBEAFE 100%)" }}
      >
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div
        className="flex flex-col justify-center items-center min-h-screen text-center px-4"
        style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #DBEAFE 100%)" }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Bạn cần đăng nhập để xem lịch sử đơn hàng
        </h2>
        <button
          onClick={() => router.push("/authscreen/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto p-6 min-h-screen"
      style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #DBEAFE 100%)" }}
    >
      {/* Nút quay lại */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
        aria-label="Quay lại trang trước"
      >
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <h1 className="text-3xl font-extrabold mb-8 text-blue-800">📜 Lịch sử đơn hàng</h1>

      {error && (
        <p className="text-center text-red-600 mb-6 font-semibold">{error}</p>
      )}

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Bạn chưa có đơn hàng nào.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md p-6 border border-blue-100"
            >
              <div className="flex justify-between text-sm text-gray-600 mb-3 font-mono">
                <span>
                  Mã đơn: <span className="font-semibold">{order._id}</span>
                </span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>

              <ul className="divide-y divide-gray-200 mb-4">
                {order.products.map((item, idx) => (
                  <li key={idx} className="flex justify-between py-2 text-gray-700">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toLocaleString()}₫</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-green-700">
                  Tổng: {order.totalAmount.toLocaleString()}₫
                </div>
                <div
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    order.status.toLowerCase() === "đã giao"
                      ? "bg-green-100 text-green-800"
                      : order.status.toLowerCase() === "đang xử lý"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Trạng thái: {order.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
