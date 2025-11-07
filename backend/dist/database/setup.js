"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const setupDatabase = async () => {
    try {
        console.log('Setting up database...');
        // Create products table
        await db_1.default.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // Create cart_items table
        await db_1.default.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // Create orders table
        await db_1.default.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        order_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // Insert mock products
        const productCount = await db_1.default.query('SELECT COUNT(*) FROM products');
        if (parseInt(productCount.rows[0].count) === 0) {
            console.log('Inserting mock products...');
            await db_1.default.query(`
        INSERT INTO products (name, price, description, image_url) VALUES
        ('Wireless Headphones', 79.99, 'High-quality wireless headphones with noise cancellation', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
        ('Smart Watch', 199.99, 'Fitness tracker with heart rate monitor', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
        ('Laptop Stand', 49.99, 'Ergonomic aluminum laptop stand', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'),
        ('Mechanical Keyboard', 129.99, 'RGB mechanical gaming keyboard', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'),
        ('USB-C Hub', 39.99, 'Multi-port USB-C hub with HDMI', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400'),
        ('Wireless Mouse', 59.99, 'Ergonomic wireless mouse with precision tracking', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400'),
        ('Phone Case', 24.99, 'Protective case with slim design', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400'),
        ('Portable Charger', 44.99, 'High-capacity 20000mAh power bank', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'),
        ('Bluetooth Speaker', 89.99, 'Waterproof portable speaker with 360 sound', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'),
        ('Webcam HD', 69.99, '1080p webcam with autofocus', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400')
      `);
            console.log('Mock products inserted successfully');
        }
        console.log('Database setup completed successfully');
    }
    catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    }
};
setupDatabase()
    .then(() => {
    console.log('Done');
    process.exit(0);
})
    .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
});
