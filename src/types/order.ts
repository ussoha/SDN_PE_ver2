export interface IOrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  _id?: string;
  userId: string;
  products: IOrderItem[];
  totalAmount: number;
  status: "unpaid" | "paid";
  createdAt?: string;
  updatedAt?: string;
}
