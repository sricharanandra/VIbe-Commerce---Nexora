import { Router, Request, Response } from 'express';
import { query } from '../database/db';
import { Product } from '../types';

const router = Router();

// GET /api/products - Get all products
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM products ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM products WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

export default router;
