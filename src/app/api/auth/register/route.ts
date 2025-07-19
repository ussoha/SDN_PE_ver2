import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // KHÔNG dùng req.body
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã tồn tại" },
        { status: 422 }
      );
    }

    const hashedPassword = await hash(password, 12);
    const newUser = await User.create({ email, password: hashedPassword });

    return NextResponse.json(
      { message: "Đăng ký thành công", userId: newUser._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    return NextResponse.json({ message: "Đăng ký thất bại" }, { status: 500 });
  }
}
