import React, { useEffect, useState } from 'react'

const ProductMenu = () => {

    useEffect(() => {

        fetchproduct();
    }, [])

    const fetchproduct = async () => {
        const product = await fetch('https://dummyjson.com/products?limit=194')
        const json = await product.json();


    }


}




export default ProductMenu
