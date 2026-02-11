// src/pages/OrderPage.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Truck, RotateCcw, ShieldCheck, CreditCard, DollarSign } from "lucide-react";

const IconBadge = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 bg-amber-50 px-3 py-2 rounded-md shadow-sm">
        <Icon className="w-5 h-5 text-yellow-600" />
        <span className="text-sm font-medium">{title}</span>
    </div>
)

const OrderSummary = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const selectedProducts = state?.selectedProducts || [];
    const incomingPaymentMethod = state?.paymentMethod || 'card'
    const [showPopup, setShowPopup] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(incomingPaymentMethod)
    const [billingName, setBillingName] = useState('')
    const [billingPhone, setBillingPhone] = useState('')
    const [billingAddress, setBillingAddress] = useState('')

    const totals = useMemo(() => {
        const subtotal = selectedProducts.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
        const shipping = subtotal > 500 ? 0 : subtotal === 0 ? 0 : 40
        const tax = +(subtotal * 0.12).toFixed(2)
        const total = +(subtotal + shipping + tax).toFixed(2)
        return { subtotal, shipping, tax, total }
    }, [selectedProducts])

    if (selectedProducts.length === 0) {
        return <h2 className="p-6 text-center">No items selected</h2>;
    }

    const PlaceOrder = () => {
        // simple validation
        if (!billingName || !billingPhone || !billingAddress) {
            alert("Please fill billing details.")
            return
        }


        const order = {
            id: Date.now(), // unique id
            date: new Date().toISOString(),
            items: selectedProducts.map(p => ({
                id: p.id,
                title: p.title,
                price: p.price,
                quantity: p.quantity,
                image: p.image || p.images?.[0] || null,
            })),
            billing: { name: billingName, phone: billingPhone, address: billingAddress },
            paymentMethod,
            totals
        };

        // read existing orders from localStorage
        const existing = JSON.parse(localStorage.getItem('myOrders') || '[]');

        // push new order at start (latest first)
        existing.unshift(order);

        // save back
        localStorage.setItem('myOrders', JSON.stringify(existing));

        // show success popup
        setShowPopup(true);
    };
    return (
        <div className="min-h-screen p-6 flex justify-center">
            <div className="w-full max-w-4xl flex flex-col gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h1 className="text-2xl font-bold">Order Summary</h1>

                    {selectedProducts.map((item) => {
                        const img = item.image || item.images?.[0] || 'https://via.placeholder.com/120'
                        return (
                            <div key={item.id} className="flex gap-4 items-center mt-4">
                                <img src={img} alt={item.title} className="w-24 h-24 object-contain bg-gray-50 p-2 rounded-lg" />
                                <div className="flex-1">
                                    <div className="font-semibold">{item.title}</div>
                                    <div className="text-sm text-gray-600 line-clamp-2">{item.description}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                </div>
                            </div>
                        )
                    })}

                    <hr className="my-4" />

                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span>${totals.tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between font-bold text-lg mt-3">
                        <span>Total</span>
                        <span>${totals.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Billing + payment */}
                <div className="bg-white rounded-xl p-6 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="font-semibold mb-3">Billing details</h2>
                        <input value={billingName} onChange={e => setBillingName(e.target.value)} placeholder="Full name" className="w-full border p-2 rounded-md mb-3" />
                        <input value={billingPhone} onChange={e => setBillingPhone(e.target.value)} placeholder="Phone" className="w-full border p-2 rounded-md mb-3" />
                        <textarea value={billingAddress} onChange={e => setBillingAddress(e.target.value)} placeholder="Address" className="w-full border p-2 rounded-md" rows={4} />
                    </div>

                    <div>
                        <h2 className="font-semibold mb-3">Payment method</h2>

                        <div className="flex flex-col gap-3">
                            <label className={`flex items-center gap-3 p-3 rounded-md border ${paymentMethod === 'card' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'} cursor-pointer`}>
                                <input type="radio" name="pay" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                <CreditCard className="w-5 h-5" />
                                <div>
                                    <div className="font-medium">Card / UPI</div>
                                    <div className="text-sm text-gray-500">Visa, MasterCard, UPI</div>
                                </div>
                            </label>

                            <label className={`flex items-center gap-3 p-3 rounded-md border ${paymentMethod === 'cod' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'} cursor-pointer`}>
                                <input type="radio" name="pay" className="hidden" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                <DollarSign className="w-5 h-5" />
                                <div>
                                    <div className="font-medium">Cash on delivery</div>
                                    <div className="text-sm text-gray-500">Pay when you receive</div>
                                </div>
                            </label>

                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <IconBadge icon={Truck} title="Fast Shipping" />
                                <IconBadge icon={RotateCcw} title="Easy Returns" />
                                <IconBadge icon={ShieldCheck} title="Secure Payments" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => PlaceOrder()} className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold">Place Order</button>
                    <button onClick={() => navigate(-1)} className="flex-1 border border-gray-300 py-3 rounded-lg">Back</button>
                </div>
            </div>

            {/* popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                        <h2 className="text-2xl font-bold text-green-600">🎉 Order Placed</h2>
                        <p className="mt-3">Thanks {billingName || ''}! Your order is confirmed.</p>
                        <div className="mt-4 text-sm text-gray-600">Payment: {paymentMethod === 'card' ? 'Card/UPI' : 'Cash on Delivery'}</div>

                        <div className="mt-6 flex gap-3 justify-center">
                            <button onClick={() => navigate('/')} className="bg-blue-500 text-white px-4 py-2 rounded">Go Home</button>
                            <button onClick={() => { setShowPopup(false); navigate('/orders') }} className="bg-white border px-4 py-2 rounded">View Orders</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



export default OrderSummary;
