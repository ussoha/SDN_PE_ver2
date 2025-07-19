"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    // Clear cart if needed (đã làm trong /checkout rồi)
  }, []);

  return (
    <div className="max-w-xl mx-auto text-center mt-20 p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Đặt hàng thành công!</h1>
      <p className="text-gray-700 mb-6">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>
      <Link
        href="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
}
