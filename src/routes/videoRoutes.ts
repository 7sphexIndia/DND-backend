import { Router } from 'express';
import { createVideo, deleteVideo, getVideos } from '../controllers/videoController.js';

const router = Router();

router.get('/videos', getVideos);
router.post('/videos', createVideo);
router.delete('/videos', deleteVideo);

export default router;
