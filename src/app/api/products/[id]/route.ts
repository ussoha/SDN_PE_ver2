import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import formidable from "formidable";
import { toNodeReadable } from "@/lib/toNodeReadable";
import cloudinary from "@/lib/cloudinary";

// Tắt bodyParser cho formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ GET /api/products/[id]
export async function GET(req: NextRequest) {
  await dbConnect();
  const id = req.nextUrl.pathname.split("/").pop();

  const product = await Product.findById(id).lean();
  if (!product) {
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

// ✅ PUT /api/products/[id]
export async function PUT(req: NextRequest) {
  await dbConnect();
  const id = req.nextUrl.pathname.split("/").pop();

  const form = formidable({ keepExtensions: true });
  const { fields, files } = await new Promise<{
    fields: formidable.Fields;
    files: formidable.Files;
  }>((res, rej) => {
    form.parse(toNodeReadable(req) as any, (err, flds, fls) =>
      err ? rej(err) : res({ fields: flds, files: fls })
    );
  });

  let imagePath: string | undefined;
  if (files.image) {
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    const upload = await cloudinary.uploader.upload(file.filepath, {
      folder: "products",
    });
    imagePath = upload.secure_url;
  }

  const updated = await Product.findByIdAndUpdate(
    id,
    {
      name: fields.name?.[0],
      description: fields.description?.[0],
      price: Number(fields.price?.[0]),
      ...(imagePath && { image: imagePath }),
    },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm để cập nhật" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

// ✅ DELETE /api/products/[id]
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const id = req.nextUrl.pathname.split("/").pop();

  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm để xoá" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Xoá sản phẩm thành công",
    deleted,
  });
}
