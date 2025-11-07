import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { api } from './api';
import { CartItem } from './types';
import './App.css';

function App() {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        loadCartCount();
        const interval = setInterval(loadCartCount, 2000);
        return () => clearInterval(interval);
    }, []);

    const loadCartCount = async () => {
        try {
            const cart = await api.getCart();
            const count = cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
            setCartCount(count);
        } catch (err) {
            console.error('Failed to load cart count:', err);
        }
    };

    return (
        <Router>
            <div className="app">
                <header className="header">
                    <nav className="nav">
                        <Link to="/" className="logo">Vibe Commerce</Link>
                        <div className="nav-links">
                            <Link to="/" className="nav-link">Products</Link>
                            <Link to="/cart" className="nav-link">
                                Cart
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                        </div>
                    </nav>
                </header>

                <main className="main">
                    <Routes>
                        <Route path="/" element={<Products />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
