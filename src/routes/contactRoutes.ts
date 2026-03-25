import { Router } from 'express';
import { submitContact, getContacts, testDBConnection } from '../controllers/contactController.js';

const router = Router();

router.post('/contact', submitContact);
router.get('/contacts', getContacts);
router.get('/test-db', testDBConnection);

export default router;
