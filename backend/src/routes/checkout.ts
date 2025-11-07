import { Router, Request, Response } from 'express';
import { query } from '../database/db';
import { CheckoutRequest } from '../types';

const router = Router();

// POST /api/checkout - Process checkout
router.post('/', async (req: Request, res: Response) => {
    try {
        const { customerName, customerEmail, cartItems }: CheckoutRequest = req.body;

        if (!customerName || !customerEmail || !cartItems || cartItems.length === 0) {
            return res.status(400).json({
                error: 'Customer name, email, and cart items are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Calculate total
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        // Create order
        const orderData = {
            items: cartItems.map(item => ({
                productId: item.product_id,
                productName: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                subtotal: item.product.price * item.quantity
            }))
        };

        const orderResult = await query(
            `INSERT INTO orders (customer_name, customer_email, total_amount, order_data) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
            [customerName, customerEmail, total, JSON.stringify(orderData)]
        );

        const order = orderResult.rows[0];

        // Clear cart after successful checkout
        await query('DELETE FROM cart_items');

        // Return receipt
        res.status(201).json({
            orderId: order.id,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            items: orderData.items,
            total: parseFloat(order.total_amount),
            timestamp: order.created_at
        });
    } catch (error) {
        console.error('Error processing checkout:', error);
        res.status(500).json({ error: 'Failed to process checkout' });
    }
});

// GET /api/checkout/orders - Get all orders (bonus feature)
router.get('/orders', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

export default router;
