"use client";

import { getCsrfToken, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token ?? undefined);
    };
    fetchToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegister) {
      // Đăng ký
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Lỗi khi đăng ký");
        return;
      }

      alert("Đăng ký thành công!");
      setIsRegister(false); // chuyển sang đăng nhập
      setPassword(""); // reset password
    } else {
      // Đăng nhập
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Sai email hoặc mật khẩu");
      } else {
        router.push("/"); // chuyển hướng sau đăng nhập
      }
    }
  };

  if (!csrfToken) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4">
          {isRegister ? "Đăng ký" : "Đăng nhập"}
        </h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input type="hidden" name="csrfToken" defaultValue={csrfToken} />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-3 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full mb-4 px-3 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
        </button>

        <p className="mt-4 text-sm text-center">
          {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Đăng nhập" : "Đăng ký"}
          </button>
        </p>
      </form>
    </div>
  );
}
