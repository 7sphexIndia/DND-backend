import type { RowDataPacket } from 'mysql2';

export interface Admin extends RowDataPacket {
  id: number;
  username: string;
  email: string | null;
  password: string;
  role: 'admin';
  created_at: Date;
}

export interface SafeAdmin {
  id: number;
  username: string;
  email: string | null;
  role: 'admin';
  created_at: Date;
}
