import { Router } from 'express';
import { createProduct, updateProductStatus as deleteProduct, getProducts, updateProduct, getCategories, getCategoryBySlugOrId, createCategory, updateCategory } from '../controllers/productController.js';

const router = Router();

router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products', deleteProduct);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.get('/categories/:slug', getCategoryBySlugOrId);

export default router;
