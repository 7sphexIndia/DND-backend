import type { Request, Response } from 'express';
import pool from '../config/db.js';
import type { VideoItem } from '../models/videoModel.js';

export const getVideos = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<VideoItem[]>(
      'SELECT id, video_url, created_at FROM videos ORDER BY created_at DESC'
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
