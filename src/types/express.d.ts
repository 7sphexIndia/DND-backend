import type { SafeAdmin } from '../models/adminModel.js';

declare global {
  namespace Express {
    interface Request {
      admin?: SafeAdmin;
    }
  }
}

export {};
