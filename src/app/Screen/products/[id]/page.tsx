"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IProduct } from "@/models/Product";
import { useSession } from "next-auth/react";
import LoginModal from "@/app/Screen/Components/ModalRequest";
import { ArrowLeft, ShoppingCart, PlusCircle } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch(console.error);
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!session) return setShowLoginModal(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            productId: product!._id,
            name: product!.name,
            price: product!.price,
            image: product!.image ?? "",
            quantity: 1,
          },
        }),
      });
      if (!res.ok) throw new Error();
      alert("✅ Thêm vào giỏ thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Thêm thất bại");
    }
  };

  const handleBuyNow = async () => {
    if (!session) return setShowLoginModal(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: [
            {
              productId: product!._id,
              name: product!.name,
              price: product!.price,
              image: product!.image ?? "",
              quantity: 1,
            },
          ],
        }),

      });
      await fetch(`/api/products/${product!._id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
      if (!res.ok) throw new Error();
      router.push("/successPage");
    } catch (err) {
      console.error(err);
      alert("❌ Đặt hàng thất bại");
    }
  };

  if (!product) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          fontSize: "1.25rem",
          color: "#4B5563",
          backgroundColor: "#E0F2FE", // xanh nhạt
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FFFFFF 0%, #DBEAFE 100%)", // gradient trắng - xanh dương nhạt
        minHeight: "100vh",
        padding: "3rem 1.5rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          boxShadow: "0 12px 28px rgba(59, 130, 246, 0.15)", // shadow xanh dương nhẹ
          padding: "2.5rem 3rem",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            border: "none",
            background: "transparent",
            color: "#2563EB",
            fontSize: "1.1rem",
            cursor: "pointer",
            marginBottom: "2rem",
            fontWeight: "600",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1D4ED8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#2563EB")}
          aria-label="Quay lại trang trước"
        >
          <ArrowLeft size={20} style={{ marginRight: "0.6rem" }} />
          Quay lại
        </button>

        <div
          style={{
            display: "flex",
            gap: "3rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Ảnh sản phẩm */}
          <div
            style={{
              flex: "1 1 400px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.2)",
              cursor: "zoom-in",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={product.image || "/uploads/cute.jpg"}
              alt={product.name}
              style={{
                width: "100%",
                height: "420px",
                objectFit: "cover",
                userSelect: "none",
                display: "block",
              }}
              draggable={false}
            />
          </div>

          {/* Nội dung sản phẩm */}
          <div
            style={{
              flex: "1.2 1 400px",
              display: "flex",
              flexDirection: "column",
              gap: "1.8rem",
            }}
          >
            <div
              style={{
                padding: "16px",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Tên sản phẩm */}
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1E3A8A", // xanh đậm
                  marginBottom: "0.5rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={product.name}
              >
                {product.name}
              </h2>

              {/* Mô tả sản phẩm */}
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#6B7280", // xám nhẹ
                  marginBottom: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.4,
                  minHeight: "4.2em", // cố định chiều cao 3 dòng
                }}
              >
                {product.description}
              </p>

              {/* Giá sản phẩm */}
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "800",
                  color: "#059669", // xanh lá nổi bật
                  padding: "6px 12px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(5, 150, 105, 0.1)", // nền xanh lá nhạt
                  width: "fit-content",
                  boxShadow: "0 2px 6px rgba(5, 150, 105, 0.3)",
                  alignSelf: "flex-start",
                  userSelect: "none",
                }}
                aria-label={`Giá sản phẩm: ${Number(
                  product.price
                ).toLocaleString()} đồng`}
              >
                {Number(product.price).toLocaleString()}₫
              </div>
            </div>

            {/* Nút thao tác */}
            <div
              style={{
                display: "flex",
                gap: "1.2rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleBuyNow}
                style={{
                  padding: "0.85rem 2rem",
                  backgroundColor: "#2563EB",
                  color: "#fff",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  boxShadow: "0 6px 15px rgba(37, 99, 235, 0.4)",
                  transition: "background-color 0.3s ease",
                  flex: "1 1 150px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1E40AF")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2563EB")
                }
                aria-label="Mua ngay sản phẩm"
              >
                <ShoppingCart size={22} />
                Mua ngay
              </button>

              <button
                onClick={handleAddToCart}
                style={{
                  padding: "0.85rem 2rem",
                  backgroundColor: "#E0E7FF",
                  color: "#1E40AF",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  border: "2px solid #2563EB",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                  flex: "1 1 150px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563EB";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#E0E7FF";
                  e.currentTarget.style.color = "#1E40AF";
                }}
                aria-label="Thêm sản phẩm vào giỏ hàng"
              >
                <PlusCircle size={22} />
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
