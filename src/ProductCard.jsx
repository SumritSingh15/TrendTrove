import React from 'react'

const ProductCard = ({ info }) => {

    const { title, price, images, description } = info
    const trimtitle = (title, wordlimit) => {
        const words = title.split(" ");
        return words.length > wordlimit ? words.slice(0, wordlimit).join(" ") + "..." : title;
    }
    const trimDescription = (description, wordlimit) => {
        const words = description.split(" ");
        return words.length > wordlimit ? words.slice(0, wordlimit).join(" ") + "..." : title;

    }
    return (
        <div className="w-80 min-h-105 p-5 m-5 
bg-white/80 backdrop-blur-lg border border-gray-200 
rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition">

            <img src={images[0]}
                className="w-full h-60 object-contain bg-linear-to-br from-gray-100 to-gray-200 rounded-xl p-4" />

            <h1 className="text-lg font-semibold text-gray-800 mt-3">
                {trimtitle(title, 7)}
            </h1>

            <p className="text-gray-600 text-sm mt-1">
                {trimDescription(description, 15)}
            </p>

            <h2 className="text-purple-600 font-bold text-xl">
                ${price}
            </h2>
        </div>

    )
}

export default ProductCard
