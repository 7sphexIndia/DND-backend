import type { Request, Response } from 'express';
import pool from '../config/db.js';
import type { GalleryItem } from '../models/galleryModel.js';

import { apiCache } from '../utils/cache.js';

const isValidHttpUrl = (value: string) => {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

export const getGalleryItems = async (req: Request, res: Response) => {
  try {
    const cachedData = apiCache.get<GalleryItem[]>('gallery');
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const [rows] = await pool.query<GalleryItem[]>(
      'SELECT id, title, image, description, created_at FROM gallery ORDER BY created_at DESC'
    );

    apiCache.set('gallery', rows);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
};

export const createGalleryItem = async (req: Request, res: Response) => {
  const { title, image, description, category } = req.body;
  const normalizedDescription = description ?? category ?? null;
  const normalizedImage = typeof image === 'string' ? image.trim() : '';

  if (!title || !normalizedImage) {
    return res.status(400).json({ error: 'Title and image are required' });
  }

  if (normalizedImage.startsWith('data:')) {
    return res.status(400).json({ error: 'Use an image URL instead of uploading base64 data' });
  }

  if (!isValidHttpUrl(normalizedImage)) {
    return res.status(400).json({ error: 'Image must be a valid http or https URL' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO gallery (title, image, description) VALUES (?, ?, ?)',
      [title, normalizedImage, normalizedDescription]
    );

    const galleryId = (result as { insertId: number }).insertId;
    const [rows] = await pool.query<GalleryItem[]>(
      'SELECT id, title, image, description, created_at FROM gallery WHERE id = ? LIMIT 1',
      [galleryId]
    );

    apiCache.delete('gallery');
    return res.status(201).json({
      message: 'Gallery item created successfully',
      item: rows[0] ?? {
        id: galleryId,
        title,
        image: normalizedImage,
        description: normalizedDescription,
      },
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  const rawId = req.query.id ?? req.body?.id ?? req.params?.id;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'A valid gallery id is required' });
  }

  try {
    const [result] = await pool.execute(
      'DELETE FROM gallery WHERE id = ?',
      [id]
    );

    const affectedRows = (result as { affectedRows: number }).affectedRows;

    if (!affectedRows) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    apiCache.delete('gallery');
    return res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
};
