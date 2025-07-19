import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/db";
import Cart from "@/models/Cart";
import { CartProduct } from "@/types/cart";

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const cart = await Cart.findOne({ userId });
  return NextResponse.json(cart || { products: [] });
}
export async function PUT(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const { productId, quantity } = await req.json();

  if (!productId || quantity < 1) {
    return NextResponse.json(
      { message: "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return NextResponse.json(
      { message: "Không tìm thấy giỏ hàng" },
      { status: 404 }
    );
  }

  const index = cart.products.findIndex(
    (p: CartProduct) => p.productId.toString() === productId
  );

  if (index === -1) {
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm trong giỏ hàng" },
      { status: 404 }
    );
  }

  cart.products[index].quantity = quantity;
  await cart.save();

  return NextResponse.json(cart);
}
export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const { product } = await req.json();

  if (
    !product ||
    !product.productId ||
    !product.name ||
    typeof product.price !== "number" ||
    !product.quantity
  ) {
    return NextResponse.json(
      { message: "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      products: [product],
    });
  } else {
    const index = cart.products.findIndex(
      (p: CartProduct) => p.productId.toString() === product.productId
    );

    if (index !== -1) {
      cart.products[index].quantity += product.quantity;
    } else {
      cart.products.push(product);
    }

    await cart.save();
  }

  return NextResponse.json(cart);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { productId } = body;
  debugger;
  let updatedCart;

  if (productId) {
    // Xoá 1 sản phẩm
    updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } },
      { new: true }
    );
  } else {
    // Xoá toàn bộ giỏ hàng
    updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { products: [] } },
      { new: true }
    );
  }
  return NextResponse.json(updatedCart);
}
