export interface Item {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface AdminUser {
  username: string;
}
