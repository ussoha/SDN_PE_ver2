"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IProduct } from "@/models/Product";
import LoginModal from "./Screen/Components/ModalRequest";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [filterSearch, setFilterSearch] = useState("");
  const [filterMin, setFilterMin] = useState("0");
  const [filterMax, setFilterMax] = useState("1000000000");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(8);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const applyFilter = () => {
    setFilterSearch(search.trim());
    setFilterMin(minPrice || "0");
    setFilterMax(maxPrice || "1000000000");
    setPage(1);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page, filterSearch, filterMin, filterMax]);

  const fetchProducts = async () => {
    const query = new URLSearchParams({
      search: filterSearch,
      min: filterMin,
      max: filterMax,
      page: page.toString(),
      limit: limit.toString(),
    });

    try {
      const res = await fetch(`/api/products?${query.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu");
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setProducts([]);
    }
  };

  const addToCart = async (product: IProduct) => {
    if (!session) return setShowLoginModal(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        }),
      });

      if (!res.ok) throw new Error("Lỗi khi thêm vào giỏ hàng");
      alert("✅ Đã thêm vào giỏ hàng");
    } catch (err) {
      console.error("Lỗi thêm vào giỏ hàng:", err);
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 py-10"
      style={{
        background: "#fff",
        borderRadius: 24,
        border: "1px solid #e5e7eb",
        minHeight: "80vh",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          🏍️ Danh sách sản phẩm
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (!session) setShowLoginModal(true);
              else router.push("/create");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow font-semibold transition"
            style={{
              boxShadow: "0 4px 12px rgba(37,99,235,0.18)",
            }}
          >
            + Thêm sản phẩm
          </button>
          <Link
            href="/cart"
            className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl shadow font-semibold transition"
            style={{
              boxShadow: "0 4px 12px rgba(236,72,153,0.18)",
            }}
          >
            🛒 Giỏ hàng
          </Link>
          <Link
            href="/orders"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow font-semibold transition"
            style={{
              boxShadow: "0 4px 12px rgba(99,102,241,0.18)",
            }}
          >
            📦 Đơn hàng
          </Link>
          {session ? (
            <button
              onClick={() => signOut({ redirect: false })}
              className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2.5 rounded-xl shadow font-semibold transition"
            >
              🔓 Đăng xuất
            </button>
          ) : (
            <button
              onClick={() => router.push("/authscreen/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow font-semibold transition"
            >
              🔐 Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Bộ lọc */}
      <div
        className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        style={{
          background: "#f9fafb",
          borderRadius: 18,
          padding: "18px 16px",
          boxShadow: "0 2px 8px rgba(31,38,135,0.05)",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Tìm theo tên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:border-blue-500 outline-none transition"
          style={{
            fontSize: 16,
            background: "#fff",
          }}
        />
        <input
          type="number"
          placeholder="💰 Giá từ"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:border-blue-500 outline-none transition"
          style={{
            fontSize: 16,
            background: "#fff",
          }}
        />
        <input
          type="number"
          placeholder="💸 Giá đến"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:border-blue-500 outline-none transition"
          style={{
            fontSize: 16,
            background: "#fff",
          }}
        />
        <button
          onClick={applyFilter}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          style={{
            fontSize: 16,
            boxShadow: "0 2px 8px rgba(16,185,129,0.12)",
          }}
        >
          ⚙️ Áp dụng lọc
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.isArray(products) &&
          products.map((p) => (
            <div
              key={p._id.toString()}
              className="bg-white rounded-2xl shadow hover:shadow-2xl transition overflow-hidden flex flex-col justify-between"
              style={{
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(16,185,129,0.12)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Link href={`/products/${p._id}`} className="block">
                <img
                  src={p.image?.trim() ? p.image : "/uploads/cute.jpg"}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                  style={{
                    background: "#f3f4f6",
                    userSelect: "none",
                  }}
                  draggable={false}
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-bold text-gray-800 truncate">
                    {p.name}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-2 min-h-[2.5em]">
                    {p.description}
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {Number(p.price).toLocaleString()}₫
                  </p>
                </div>
              </Link>
              <div className="flex justify-between px-4 pb-4 gap-2">
                <button
                  onClick={() => {
                    if (!session) setShowLoginModal(true);
                    else router.push(`/edit/${p._id}`);
                  }}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white text-sm py-2 rounded-lg text-center font-semibold shadow transition"
                  style={{
                    boxShadow: "0 2px 8px rgba(251,191,36,0.14)",
                  }}
                >
                  ✏️ Sửa sản phẩm
                </button>
                <button
                  onClick={() => addToCart(p)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded-lg font-semibold shadow transition"
                  style={{
                    boxShadow: "0 2px 8px rgba(59,130,246,0.14)",
                  }}
                >
                  🛒 Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-center mt-10 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold flex items-center justify-center transition disabled:opacity-50"
          >
            ◀
          </button>
          {Array.from({ length: Math.ceil(total / limit) }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition ${
                page === idx + 1
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100"
              }`}
              style={{
                margin: "0 2px",
              }}
            >
              {idx + 1}
            </button>
          ))}
          <button
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage(page + 1)}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold flex items-center justify-center transition disabled:opacity-50"
          >
            ▶
          </button>
        </div>
      )}

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
