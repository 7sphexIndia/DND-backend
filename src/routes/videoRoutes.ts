import { Router } from 'express';
import { getVideos } from '../controllers/videoController.js';

const router = Router();

router.get('/videos', getVideos);

export default router;
