import { Router } from 'express';
import {
  createGalleryItem,
  deleteGalleryItem,
  getGalleryItems,
} from '../controllers/galleryController.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/gallery', getGalleryItems);
router.post('/gallery', upload.single('image'), createGalleryItem);
router.delete('/gallery', deleteGalleryItem);

export default router;
