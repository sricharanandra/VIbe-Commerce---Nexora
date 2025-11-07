const API_BASE_URL = '/api';

export const api = {
    // Products
    getProducts: async () => {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    // Cart
    getCart: async () => {
        const response = await fetch(`${API_BASE_URL}/cart`);
        if (!response.ok) throw new Error('Failed to fetch cart');
        return response.json();
    },

    addToCart: async (productId: number, quantity: number = 1) => {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity })
        });
        if (!response.ok) throw new Error('Failed to add to cart');
        return response.json();
    },

    updateCartItem: async (id: number, quantity: number) => {
        const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });
        if (!response.ok) throw new Error('Failed to update cart item');
        return response.json();
    },

    removeFromCart: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to remove from cart');
        return response.json();
    },

    clearCart: async () => {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to clear cart');
        return response.json();
    },

    // Checkout
    checkout: async (customerName: string, customerEmail: string, cartItems: any[]) => {
        const response = await fetch(`${API_BASE_URL}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerName, customerEmail, cartItems })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to process checkout');
        }
        return response.json();
    }
};
