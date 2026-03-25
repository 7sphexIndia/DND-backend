export interface Contact {
  id?: number;
  name: string;
  phone: string;
  email: string;
  company: string;
  city: string;
  inquiry_type: string;
  message: string;
  created_at?: Date;
}
