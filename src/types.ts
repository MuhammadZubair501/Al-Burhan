export type Role = 'admin' | 'coordinator' | 'user';

export interface UserAccount {
  username: string;
  role: Role;
}

export interface DataItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
}
