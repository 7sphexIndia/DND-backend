import type { RowDataPacket } from 'mysql2';

export interface VideoItem extends RowDataPacket {
  id: number;
  video_url: string;
  created_at: Date;
}
