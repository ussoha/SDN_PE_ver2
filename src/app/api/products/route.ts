import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary"; // THÊM DÒNG NÀY

export const config = {
  api: {
    bodyParser: false, // BẮT BUỘC khi dùng formidable
  },
};

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "8");
  const keyword = searchParams.get("search") || "";
  const min = parseInt(searchParams.get("min") || "0");
  const max = parseInt(searchParams.get("max") || "1000000000");

  const skip = (page - 1) * limit;

  // Xây filter object
  const query: any = {
    name: { $regex: keyword, $options: "i" }, // search tên (không phân biệt hoa thường)
    price: { $gte: min, $lte: max }, // khoảng giá
  };

  try {
    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ products, total });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    // Chuyển đổi request thành FormData
    const formData = await req.formData();
    
    // Trích xuất dữ liệu
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const imageFile = formData.get("image") as File | null;

    let imageUrl = "";
    if (imageFile) {
      // Chuyển File thành ArrayBuffer
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Upload lên Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      imageUrl = (uploadResult as any).secure_url;
    }

    // Tạo sản phẩm mới
    const product = new Product({
      name,
      description,
      price,
      image: imageUrl,
    });
    
    await product.save();
    return NextResponse.json(product, { status: 201 });
    
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    return NextResponse.json(
      { message: "Lỗi server", error: String(error) },
      { status: 500 }
    );
  }
}

