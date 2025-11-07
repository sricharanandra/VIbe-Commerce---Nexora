export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image_url: string;
    created_at: Date;
}

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    created_at: Date;
    product?: Product;
}

export interface CartItemWithProduct extends CartItem {
    product: Product;
}

export interface Order {
    id: number;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    order_data: any;
    created_at: Date;
}

export interface CheckoutRequest {
    customerName: string;
    customerEmail: string;
    cartItems: CartItemWithProduct[];
}
