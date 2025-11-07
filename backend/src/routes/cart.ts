import { Router, Request, Response } from 'express';
import { query } from '../database/db';
import { CartItem, CartItemWithProduct } from '../types';

const router = Router();

// GET /api/cart - Get cart with products and total
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await query(`
      SELECT 
        ci.id,
        ci.product_id,
        ci.quantity,
        ci.created_at,
        p.name,
        p.price,
        p.description,
        p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      ORDER BY ci.created_at DESC
    `);

        const cartItems: CartItemWithProduct[] = result.rows.map(row => ({
            id: row.id,
            product_id: row.product_id,
            quantity: row.quantity,
            created_at: row.created_at,
            product: {
                id: row.product_id,
                name: row.name,
                price: parseFloat(row.price),
                description: row.description,
                image_url: row.image_url,
                created_at: row.created_at
            }
        }));

        const total = cartItems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            items: cartItems,
            total: parseFloat(total.toFixed(2))
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// POST /api/cart - Add item to cart
router.post('/', async (req: Request, res: Response) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        // Check if product exists
        const productResult = await query('SELECT * FROM products WHERE id = $1', [productId]);
        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if item already in cart
        const existingItem = await query(
            'SELECT * FROM cart_items WHERE product_id = $1',
            [productId]
        );

        let result;
        if (existingItem.rows.length > 0) {
            // Update quantity
            result = await query(
                'UPDATE cart_items SET quantity = quantity + $1 WHERE product_id = $2 RETURNING *',
                [quantity, productId]
            );
        } else {
            // Insert new item
            result = await query(
                'INSERT INTO cart_items (product_id, quantity) VALUES ($1, $2) RETURNING *',
                [productId, quantity]
            );
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
});

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Valid quantity is required' });
        }

        const result = await query(
            'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
            [quantity, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Item removed from cart', item: result.rows[0] });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', async (req: Request, res: Response) => {
    try {
        await query('DELETE FROM cart_items');
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

export default router;
