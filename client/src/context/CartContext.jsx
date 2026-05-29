import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const handlingFee = 7;
    const deliveryCharge = cart.length > 0 && total < 500 ? 50 : 0;
    const finalTotal = cart.length > 0 ? total + handlingFee + deliveryCharge : 0;

    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error("Cart save error:", e);
        }
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item._id === product._id);
            if (existing) {
                return prevCart.map(item =>
                    item._id === product._id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prevCart, { ...product, qty: 1 }];
        });
        alert(`${product.name} added to bag!`);
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
    };

    const updateQty = (productId, qty) => {
        if (qty < 1) return;
        setCart(prevCart => prevCart.map(item => 
            item._id === productId ? { ...item, qty } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            total, 
            handlingFee, 
            deliveryCharge, 
            finalTotal, 
            addToCart, 
            removeFromCart, 
            updateQty, 
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};
