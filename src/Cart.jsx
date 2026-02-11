// src/components/Cart.jsx
import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addproduct, decreaseQty, removeProduct } from './CartSlice'
import { Link, useNavigate } from "react-router-dom"
import {
    CreditCard,
    Truck,
    RotateCcw,
    ShieldCheck,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    DollarSign
} from "lucide-react"

const IconBadge = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 bg-amber-50 px-3 py-2 rounded-md shadow-sm">
        <Icon className="w-5 h-5 text-yellow-600" />
        <span className="text-sm font-medium">{title}</span>
    </div>
)

const Cart = () => {
    const dispatch = useDispatch()
    const items = useSelector((store) => store.Cart.items || [])
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedPayment, setSelectedPayment] = useState('card')
    const navigate = useNavigate()

    // Totals (memoized)
    const totals = useMemo(() => {
        const subtotal = items.reduce((t, it) => t + (it.price || 0) * (it.quantity || 1), 0)
        const shipping = subtotal > 500 ? 0 : subtotal === 0 ? 0 : 40 // example rules
        const tax = +(subtotal * 0.12).toFixed(2) // 12% gst example
        const total = +(subtotal + shipping + tax).toFixed(2)
        return { subtotal, shipping, tax, total }
    }, [items])

    const handleSelect = (id) => {
        setSelectedItems(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
    }

    const handleProceed = () => {
        const selectedProducts = items.filter(it => selectedItems.includes(it.id))
        if (selectedProducts.length === 0) {
            alert("Please select at least one item to checkout.")
            return
        }
        // attach payment type to state so OrderPage can read it
        navigate('/orderSummary', { state: { selectedProducts, paymentMethod: selectedPayment } })
    }

    return (
        <div className="p-6 flex flex-col md:flex-row gap-6 justify-center">
            {/* LEFT: Items list */}
            <div className="flex-1 max-w-3xl flex flex-col gap-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6" /> Your Cart
                </h2>

                {items.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-6 text-center">Your cart is empty.</div>
                )}

                {items.map(item => {
                    const img = item.image || item.images?.[0] || 'https://via.placeholder.com/150'
                    return (
                        <div
                            key={item.id}
                            className="w-full flex bg-white rounded-xl shadow hover:shadow-xl transition p-4 relative overflow-hidden"
                        >
                            {/* Checkbox */}
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={(e) => {
                                    e.stopPropagation()
                                    handleSelect(item.id)
                                }}
                                className="absolute left-3 top-3 w-5 h-5 z-20"
                            />

                            {/* Link area (clicking navigates to product) */}
                            <Link to={`/products/${item.id}`} className="flex w-full gap-4 items-center">
                                {/* image & qty */}
                                <div className="flex flex-col items-center w-40">
                                    <img src={img} alt={item.title} className="w-32 h-32 object-contain bg-gray-50 p-2 rounded-xl" />
                                    <div className="flex items-center gap-3 mt-3">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault(); e.stopPropagation()
                                                dispatch(decreaseQty(item.id))
                                            }}
                                            className="px-3 py-1 rounded bg-amber-100 font-bold"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>

                                        <span className="text-lg font-medium">{item.quantity}</span>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault(); e.stopPropagation()
                                                dispatch(addproduct(item))
                                            }}
                                            className="px-3 py-1 rounded bg-amber-100 font-bold"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* info */}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-xl truncate">{item.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
                                    <div className="mt-3 flex items-center gap-4">
                                        <div className="text-2xl font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                                        <div className="text-sm text-gray-500">({item.quantity} x ${item.price})</div>
                                    </div>
                                </div>

                                {/* actions inside Link so we prevent default on click handlers */}
                                <div className="flex flex-col items-end gap-3">
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(removeProduct(item.id)) }}
                                        className="bg-red-100 px-3 py-2 rounded-md hover:bg-red-200 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                    </button>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>

            {/* RIGHT: Summary & Payment */}
            <aside className="w-full md:w-96 bg-white rounded-xl shadow-lg p-6 h-fit">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                <div className="flex flex-col gap-3">
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

                    <hr className="my-3" />

                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totals.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* payment method */}
                <div className="mt-6">
                    <div className="text-sm text-gray-600 mb-2">Payment method</div>
                    <div className="flex gap-2">
                        <label className={`flex items-center gap-2 p-2 rounded-md border ${selectedPayment === 'card' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'} cursor-pointer flex-1`}>
                            <input type="radio" name="payment" className="hidden" checked={selectedPayment === 'card'} onChange={() => setSelectedPayment('card')} />
                            <CreditCard className="w-5 h-5" />
                            <span className="text-sm font-medium">Card / UPI</span>
                        </label>

                        <label className={`flex items-center gap-2 p-2 rounded-md border ${selectedPayment === 'cod' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'} cursor-pointer`}>
                            <input type="radio" name="payment" className="hidden" checked={selectedPayment === 'cod'} onChange={() => setSelectedPayment('cod')} />
                            <DollarSign className="w-5 h-5" />
                            <span className="text-sm font-medium">Cash on Delivery</span>
                        </label>
                    </div>
                </div>

                {/* perks */}
                <div className="mt-6 grid grid-cols-1 gap-2">
                    <IconBadge icon={Truck} title="Fast Shipping" />
                    <IconBadge icon={RotateCcw} title="Easy Returns (30 days)" />
                    <IconBadge icon={ShieldCheck} title="Secure Payment" />
                </div>

                <button
                    onClick={handleProceed}
                    className="mt-6 w-full bg-amber-400 hover:bg-amber-500 text-white py-3 rounded-lg font-medium"
                >
                    Proceed to Checkout
                </button>

                <div className="text-sm text-gray-500 mt-3">Selected items: {selectedItems.length}</div>
            </aside>
        </div>
    )
}

export default Cart
