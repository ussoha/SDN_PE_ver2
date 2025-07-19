// components/LoginModal.tsx
"use client";
import { useRouter } from "next/navigation";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-4">🔐 Yêu cầu đăng nhập</h2>
        <p className="text-gray-600 mb-6">Bạn cần đăng nhập để thực hiện chức năng này.</p>
        <button
          onClick={() => {
            router.push("/authscreen/login");
            onClose();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}
