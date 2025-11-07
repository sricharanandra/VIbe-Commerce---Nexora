export interface Product {
    id: number;
    name: string;
    price: number | string; // PostgreSQL DECIMAL returns as string
    description: string;
    image_url: string;
    created_at: string;
}

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    created_at: string;
    product: Product;
}

export interface CartResponse {
    items: CartItem[];
    total: number | string; // PostgreSQL DECIMAL returns as string
}

export interface CheckoutData {
    customerName: string;
    customerEmail: string;
}

export interface OrderReceipt {
    orderId: number;
    customerName: string;
    customerEmail: string;
    items: {
        productId: number;
        productName: string;
        quantity: number;
        price: number;
        subtotal: number;
    }[];
    total: number;
    timestamp: string;
}
