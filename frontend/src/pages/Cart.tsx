import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { CartResponse } from '../types';

export default function Cart() {
    const [cart, setCart] = useState<CartResponse>({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const data = await api.getCart();
            setCart(data);
            setError('');
        } catch (err) {
            setError('Failed to load cart');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (id: number, quantity: number) => {
        if (quantity < 1) return;
        try {
            await api.updateCartItem(id, quantity);
            await loadCart();
        } catch (err) {
            console.error('Failed to update quantity:', err);
        }
    };

    const handleRemoveItem = async (id: number) => {
        try {
            await api.removeFromCart(id);
            await loadCart();
        } catch (err) {
            console.error('Failed to remove item:', err);
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your cart?')) return;
        try {
            await api.clearCart();
            await loadCart();
        } catch (err) {
            console.error('Failed to clear cart:', err);
        }
    };

    if (loading) {
        return <div className="loading">Loading cart...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (cart.items.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to get started</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="page-title">Shopping Cart</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {cart.items.map(item => (
                        <div key={item.id} className="cart-item">
                            <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="cart-item-image"
                            />
                            <div className="cart-item-details">
                                <h3 className="cart-item-name">{item.product.name}</h3>
                                <p className="cart-item-price">${Number(item.product.price).toFixed(2)} each</p>
                                <div className="cart-item-controls">
                                    <input
                                        type="number"
                                        className="quantity-input"
                                        value={item.quantity}
                                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                                        min="1"
                                    />
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveItem(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <p>Subtotal: ${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-secondary" onClick={handleClearCart}>
                        Clear Cart
                    </button>
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Items ({cart.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                        <span>${Number(cart.total).toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span className="summary-total">Total</span>
                        <span className="summary-total">${Number(cart.total).toFixed(2)}</span>
                    </div>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
