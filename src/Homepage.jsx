import React from "react";
import { useOutletContext } from "react-router-dom";
import ProductContainer from "./ProductContainer";

const Homepage = () => {
    const { searchResults, isSearching } = useOutletContext();

    return (
        <div className="overflow-x-hidden bg-[#1b1f45] h-screen overflow-y-scroll scrollbar-hide">
            <ProductContainer
                searchResults={searchResults}
                isSearching={isSearching}
            />
        </div>
    );
};

export default Homepage;
