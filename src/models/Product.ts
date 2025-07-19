import mongoose, { Schema, Types } from "mongoose";

// Kiểu dữ liệu của sản phẩm
export interface IProduct {
  _id: Types.ObjectId | string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

// Schema cho MongoDB
const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
  },
  {
    timestamps: true, // ✅ Tuỳ chọn: tự thêm createdAt / updatedAt
  }
);

// Nếu model đã tồn tại (hot reload dev mode), dùng lại
const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
export type ProductDocument = mongoose.HydratedDocument<IProduct>;
