export interface CartProduct {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface CartType {
  userId: string;
  products: CartProduct[];
}
