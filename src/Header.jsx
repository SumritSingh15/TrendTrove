import React, { useEffect, useState } from "react";
import Logo from "./assets/Logo_Img.png";
import { Link } from "react-router-dom";
import Cart from "./Cart";

const Header = ({ setSearchResults, setIsSearching }) => {
    const [input, setInput] = useState("");

    const searchQuery = async () => {
        // ✅ if input empty → show all products
        if (input.trim() === "") {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }

        const res = await fetch(
            `https://dummyjson.com/products/search?q=${input}`
        );
        const data = await res.json();

        setSearchResults(data.products);
        setIsSearching(true);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            searchQuery();
        }, 300);

        return () => clearTimeout(timer);
    }, [input]);

    return (
        <div className="bg-black text-white shadow-md flex flex-col w-screen sm:flex sm:flex-row justify-between p-4 items-center">
            <img src={Logo} className="w-40" />

            <input
                type="text"
                value={input}
                placeholder="Search products..."
                className="p-2 w-full sm:w-96  bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-purple-400"
                onChange={(e) => setInput(e.target.value)}
            />

            <ul className="flex gap-5 mr-5 text-2xl">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/cart">Cart </Link></li>
                <li><Link to="/orders">Orders</Link></li>
            </ul>
        </div>
    );
};

export default Header;
