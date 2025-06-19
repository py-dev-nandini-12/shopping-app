export interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    // Add other product fields as needed
  };
  quantity: number;
}
