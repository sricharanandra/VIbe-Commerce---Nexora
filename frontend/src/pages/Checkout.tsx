import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { CartResponse, OrderReceipt } from '../types';

export default function Checkout() {
    const [cart, setCart] = useState<CartResponse>({ items: [], total: 0 });
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const data = await api.getCart();
            setCart(data);
            if (data.items.length === 0) {
                navigate('/cart');
            }
        } catch (err) {
            console.error('Failed to load cart:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!customerName.trim() || !customerEmail.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (cart.items.length === 0) {
            setError('Your cart is empty');
            return;
        }

        try {
            setLoading(true);
            const receiptData = await api.checkout(customerName, customerEmail, cart.items);
            setReceipt(receiptData);
        } catch (err: any) {
            setError(err.message || 'Failed to process checkout');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseReceipt = () => {
        setReceipt(null);
        navigate('/');
    };

    if (cart.items.length === 0 && !receipt) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div>
            <h1 className="page-title">Checkout</h1>

            {error && <div className="error">{error}</div>}

            <div className="cart-container">
                <div className="checkout-form">
                    <h2>Customer Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="form-input"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    {cart.items.map(item => (
                        <div key={item.id} className="summary-row">
                            <span>{item.product.name} x {item.quantity}</span>
                            <span>${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="summary-row">
                        <span className="summary-total">Total</span>
                        <span className="summary-total">${Number(cart.total).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {receipt && (
                <div className="modal-overlay" onClick={handleCloseReceipt}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Order Confirmed</h2>
                            <button className="modal-close" onClick={handleCloseReceipt}>×</button>
                        </div>

                        <div className="success">
                            Your order has been placed successfully
                        </div>

                        <p><strong>Order ID:</strong> #{receipt.orderId}</p>
                        <p><strong>Customer:</strong> {receipt.customerName}</p>
                        <p><strong>Email:</strong> {receipt.customerEmail}</p>
                        <p><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>

                        <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Order Details</h3>
                        {receipt.items.map((item, index) => (
                            <div key={index} className="receipt-item">
                                <span>{item.productName} x {item.quantity}</span>
                                <span>${item.subtotal.toFixed(2)}</span>
                            </div>
                        ))}

                        <div className="receipt-total">
                            <span>Total</span>
                            <span>${receipt.total.toFixed(2)}</span>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem' }}
                            onClick={handleCloseReceipt}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
