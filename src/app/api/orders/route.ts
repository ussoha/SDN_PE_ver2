import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { cookies } from "next/headers";


// ✅ API GET /api/orders
export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession({
  ...authOptions,
  req: {
    headers: {
      cookie: cookies().toString(),
    },
  } as any,
});

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

// ✅ API POST /api/orders
export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { cart } = await req.json();
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ message: "Giỏ hàng trống" }, { status: 400 });
    }

    const totalAmount = cart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userId: session.user.id,
      products: cart,
      totalAmount,
    });

    await newOrder.save();
    return NextResponse.json({ message: "Đặt hàng thành công" }, { status: 201 });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  }
}
