export interface User {
  _id?: string;
  username: string;
  password?: string;
  role: 'Admin' | 'Receptionist' | 'RestaurantManager';
  phone?: string;
  token?: string;
}
