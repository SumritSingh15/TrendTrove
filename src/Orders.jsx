// src/pages/OrdersPage.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Trash2, Calendar, Package, CreditCard, DollarSign } from 'lucide-react';

// Small badge component (reusable)
const IconBadge = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-md shadow-sm">
        <Icon className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-medium">{title}</span>
    </div>
);

// Order item card — memoized so it won't re-render unless its props change
const OrderCard = React.memo(function OrderCard({ order, onDelete }) {
    // compute total for this order using useMemo (only recalculates when order.items changes)
    const totals = useMemo(() => {
        const subtotal = order.items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
        const shipping = subtotal > 500 ? 0 : subtotal === 0 ? 0 : 40;
        const tax = +(subtotal * 0.12).toFixed(2);
        const total = +(subtotal + shipping + tax).toFixed(2);
        return { subtotal, shipping, tax, total };
    }, [order.items]);

    return (
        <div className="bg-white rounded-xl shadow-lg p-5 w-full ">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center flex-col gap-3">
                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(order.date).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-700">
                        <div className="font-medium">Billing:</div>
                        <div>{order.billing.name} • {order.billing.phone}</div>
                        <div className="truncate max-w-md">{order.billing.address}</div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <IconBadge icon={Package} title={`${order.items.length} items`} />
                        <IconBadge icon={CreditCard} title={order.paymentMethod === 'cod' ? 'COD' : 'Card/UPI'} />
                        <IconBadge icon={DollarSign} title={`Total $${totals.total.toFixed(2)}`} />
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={() => onDelete(order.id)}
                        className="text-red-500 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100"
                    >
                        <Trash2 className="w-4 h-4 inline-block" /> Delete
                    </button>
                </div>
            </div>

            <div className="mt-4 border-t pt-4">
                {order.items.map(it => (
                    <div key={it.id} className="flex items-center gap-3 mb-3">
                        <img src={it.image || 'https://via.placeholder.com/80'} alt={it.title} className="w-16 h-16 object-contain rounded-md bg-gray-50 p-2" />
                        <div className="flex-1">
                            <div className="font-medium">{it.title}</div>
                            <div className="text-sm text-gray-500">Qty: {it.quantity} • ${it.price}</div>
                        </div>
                        <div className="font-semibold">${(it.price * it.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default function Orders() {
    const [orders, setOrders] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('myOrders') || '[]');
        } catch {
            return [];
        }
    });

    // handler to delete an order (useCallback for stable identity)
    const handleDelete = useCallback((orderId) => {
        const kept = orders.filter(o => o.id !== orderId);
        setOrders(kept);
        localStorage.setItem('myOrders', JSON.stringify(kept));
    }, [orders]);

    // clear all orders
    const clearAll = () => {
        if (!confirm('Clear all orders?')) return;
        setOrders([]);
        localStorage.removeItem('myOrders');
    };

    // derived value: grand totals across all orders (useMemo)
    const grandTotals = useMemo(() => {
        // This recomputes only when `orders` changes (reference comparison)
        let grand = 0;
        for (const order of orders) {
            // compute subtotal per order
            const subtotal = order.items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
            const shipping = subtotal > 500 ? 0 : subtotal === 0 ? 0 : 40;
            const tax = +(subtotal * 0.12).toFixed(2);
            const total = +(subtotal + shipping + tax).toFixed(2);
            grand += total;
        }
        return { grand: +grand.toFixed(2), count: orders.length };
    }, [orders]);

    // sync when localStorage changes externally (optional)
    useEffect(() => {
        const handler = () => {
            try {
                setOrders(JSON.parse(localStorage.getItem('myOrders') || '[]'));
            } catch {
                setOrders([]);
            }
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    return (
        <div className="min-h-screen p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Orders ({orders.length})</h1>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">Grand total:</div>
                    <div className="font-semibold text-lg">${grandTotals.grand}</div>
                    <button onClick={clearAll} className="ml-4 text-sm text-red-500 border border-red-100 px-3 py-1 rounded">Clear</button>
                </div>
            </div>

            <div className="grid gap-4">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-6 text-center">No orders yet.</div>
                ) : (
                    orders.map(order => (
                        <OrderCard key={order.id} order={order} onDelete={handleDelete} />
                    ))
                )}
            </div>
        </div>
    );
}
