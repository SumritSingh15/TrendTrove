import React, { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from "lucide-react";

const Iconbadge = ({ icon: Icon, onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`bg-white hover:bg-purple-100 border border-gray-300 shadow-sm rounded-full
"}`}
        >
            <Icon />
        </button>
    );
};

const ProductContainer = ({ searchResults = [], isSearching }) => {
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categoryIndex, setCategoryIndex] = useState(0);
    const scrollRef = useRef(null);

    // fetch all products
    useEffect(() => {
        fetch("https://dummyjson.com/products?limit=194")
            .then(res => res.json())
            .then(data => setResults(data.products));
    }, []);

    // 🔹 IMPORTANT: only products change on search
    const displayProducts = isSearching ? searchResults : results;

    // 🔹 categories always from FULL results
    const categories = ["all", ...new Set(results.map(item => item.category))];

    // 🔹 filter by category (on displayProducts)
    const filteredProducts =
        selectedCategory === "all"
            ? displayProducts
            : displayProducts.filter(item => item.category === selectedCategory);

    // 🔹 pagination
    const PAGE_SIZE = 20;
    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    // reset page when search changes
    useEffect(() => {
        setCurrentPage(0);
    }, [isSearching, searchResults]);

    const handlePrevCategory = () => {
        if (categoryIndex > 0) {
            const newIndex = categoryIndex - 1;
            setCategoryIndex(newIndex);
            setSelectedCategory(categories[newIndex]);
            setCurrentPage(0);
            scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
        }
    };

    const handleNextCategory = () => {
        if (categoryIndex < categories.length - 1) {
            const newIndex = categoryIndex + 1;
            setCategoryIndex(newIndex);
            setSelectedCategory(categories[newIndex]);
            setCurrentPage(0);
            scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
        }
    };

    return (
        <div className="mx-10 p-5  ">

            {/* CATEGORY BAR (never affected by search) */}
            <div className="flex items-center gap-2 mb-6">

                <Iconbadge icon={ChevronLeft} onClick={handlePrevCategory} disabled={categoryIndex === 0} />

                <div ref={scrollRef} className="flex gap-3 overflow-x-auto hide-scrollbar whitespace-nowrap w-full ">
                    {categories.map((cat, index) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setCategoryIndex(index);
                                setCurrentPage(0);
                            }}
                            className={`px-4 py-2 rounded-full border
              ${selectedCategory === cat ? "bg-blue-500 text-white" : "bg-white"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <Iconbadge icon={ChevronRight} onClick={handleNextCategory} disabled={categoryIndex === categories.length - 1} />
            </div>

            {/* PRODUCTS */}
            <div className="flex flex-wrap justify-center">
                {filteredProducts.slice(start, end).map(res => (
                    <Link key={res.id} to={`/products/${res.id}`}>
                        <ProductCard info={res} />
                    </Link>
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-6">
                <Iconbadge icon={ChevronLeft} onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0} />

                {[...Array(totalPages).keys()].map(num => (
                    <span
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`mx-1 px-3 py-2 border cursor-pointer rounded
            ${currentPage === num ? "bg-blue-500 text-white" : "bg-white"}`}
                    >
                        {num + 1}
                    </span>
                ))}

                <Iconbadge icon={ChevronRight} onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages - 1} />
            </div>

        </div>
    );
};

export default ProductContainer;
