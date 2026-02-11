import React, { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addproduct } from './CartSlice'
import { Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";

const IconBadge = ({ icon: Icon, title }) => {
    return (
        <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-md shadow-sm">
            <Icon className="w-6 h-6 text-yellow-600" />
            <span className="text-sm font-medium">{title}</span>
        </div>
    )
}

const ProductDetail = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const productdetail = useLoaderData() || {}

    // destructuring only required properties
    const { category, title, description, images = [], price, rating } = productdetail

    const [Quantity, SetQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(images[0])

    const Buynow = () => {
        const selectedProducts = [{ ...productdetail, quantity: Quantity || 1 }]
        navigate('/ordersummary', { state: { selectedProducts } })
    }

    const handleAddToCart = () => {
        dispatch(addproduct({ ...productdetail, quantity: Quantity || 1 }))
    }

    return (
        <div className="flex justify-center px-6 mt-14">
            <div className="max-w-4xl w-full">

                {/* IMAGE CARD */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
                    <img
                        src={selectedImage}
                        alt={title}
                        className="w-full h-100 object-contain"
                    />

                    {/* thumbnails */}
                    <div className="mt-4 flex gap-3">
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                onClick={() => setSelectedImage(img)}
                                className="w-20 h-20 object-contain cursor-pointer border rounded-md hover:border-yellow-400"
                            />
                        ))}
                    </div>
                </div>

                {/* DETAILS CARD */}
                <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8">

                    <h1 className="text-4xl font-semibold">{title}</h1>

                    <p className="mt-3 text-gray-600">{description}</p>

                    <div className="mt-2 text-sm text-gray-500 italic">{category}</div>

                    {/* rating + price */}
                    <div className="mt-6 flex items-center gap-6">
                        <div className="flex items-center gap-2 text-lg">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="font-medium">Rating</span>
                            <span className="font-semibold">{rating}</span>
                        </div>

                        <div className="ml-auto text-3xl font-bold">Price: ${price}</div>
                    </div>

                    {/* quantity */}
                    <div className="mt-6 flex items-center gap-4">
                        <button onClick={() => SetQuantity(q => (q > 1 ? q - 1 : 1))}
                            className="px-3 py-2 bg-amber-100 rounded-md text-lg font-bold">-</button>

                        <span className="text-xl">{Quantity}</span>

                        <button onClick={() => SetQuantity(q => q + 1)}
                            className="px-3 py-2 bg-amber-100 rounded-md text-lg font-bold">+</button>
                    </div>

                    {/* buttons */}
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-yellow-400 py-3 rounded-md font-medium hover:bg-yellow-500"
                        >
                            Add to Cart
                        </button>

                        <button
                            onClick={Buynow}
                            className="flex-1 border border-yellow-400 py-3 rounded-md font-medium hover:bg-yellow-50"
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* icon badges */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <IconBadge icon={Truck} title="Free Shipping" />
                        <IconBadge icon={RotateCcw} title="Easy Returns (30 days)" />
                        <IconBadge icon={ShieldCheck} title="Secure Payment & Warranty" />
                    </div>

                    {/* info line */}
                    <div className="mt-6 text-sm text-gray-500">
                        • 90 days return policy &nbsp; • Ships overnight &nbsp; • 1 week warranty
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProductDetail
