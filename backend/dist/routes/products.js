"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../database/db");
const router = (0, express_1.Router)();
// GET /api/products - Get all products
router.get('/', async (req, res) => {
    try {
        const result = await (0, db_1.query)('SELECT * FROM products ORDER BY id');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, db_1.query)('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});
exports.default = router;
