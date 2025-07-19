"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateProduct() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Tạo sản phẩm thất bại");
      router.push("/");
      router.refresh();
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo sản phẩm");
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center pt-12 pb-8 px-4"
      style={{
        background:
          "linear-gradient(135deg, #FFFFFF 0%, #DBEAFE 100%)", // gradient trắng - xanh dương nhạt
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-10 max-w-xl w-full space-y-8"
        style={{ boxShadow: "0 12px 28px rgba(59, 130, 246, 0.15)" }}
      >
        <h1 className="text-3xl font-extrabold text-blue-800 flex items-center gap-3">
          🆕 Tạo mới sản phẩm
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên sản phẩm */}
          <div>
            <label
              htmlFor="name"
              className="block font-semibold text-gray-700 mb-2"
            >
              Tên sản phẩm
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              required
              placeholder="Nhập tên sản phẩm"
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label
              htmlFor="description"
              className="block font-semibold text-gray-700 mb-2"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              required
              rows={5}
              placeholder="Mô tả chi tiết sản phẩm"
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg resize-none focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
            />
          </div>

          {/* Giá */}
          <div>
            <label
              htmlFor="price"
              className="block font-semibold text-gray-700 mb-2"
            >
              Giá (₫)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              required
              placeholder="Nhập giá sản phẩm"
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
            />
          </div>

          {/* Hình ảnh */}
          <div>
            <label
              htmlFor="image"
              className="block font-semibold text-gray-700 mb-2"
            >
              Ảnh sản phẩm
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
              className="w-full cursor-pointer"
            />

            {imageFile && (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-sm text-gray-500 mb-2">Ảnh xem trước:</p>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-32 h-32 object-cover border border-gray-300 rounded-xl shadow-md"
                />
              </div>
            )}
          </div>

          {/* Nút thao tác */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-xl transition shadow-md"
            >
              ❌ Thoát
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md"
            >
              ✅ Tạo mới sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
