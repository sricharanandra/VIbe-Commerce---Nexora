import { useState, useEffect } from 'react';
import { api } from '../api';
import { Product } from '../types';

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addingToCart, setAddingToCart] = useState<number | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
            setError('');
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId: number) => {
        try {
            setAddingToCart(productId);
            await api.addToCart(productId, 1);
        } catch (err) {
            console.error('Failed to add to cart:', err);
        } finally {
            setAddingToCart(null);
        }
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div>
            <h1 className="page-title">Products</h1>
            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="product-image"
                        />
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-description">{product.description}</p>
                            <div className="product-footer">
                                <span className="product-price">
                                    ${Number(product.price).toFixed(2)}
                                </span>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleAddToCart(product.id)}
                                    disabled={addingToCart === product.id}
                                >
                                    {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
