import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Header from "./Header";
import Homepage from "./Homepage";
import ProductDetail from "./ProductDetail";
import Cart from "./Cart";
import Orders from "./Orders";
import OrderSummary from "./OrderSummary";
import { useState } from "react";

const AppLayout = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="overflow-hidden min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header
        setSearchResults={setSearchResults}
        setIsSearching={setIsSearching}
      />

      <Outlet context={{ searchResults, isSearching }} />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <Homepage />,
      },
      {
        path: "products/:resid",
        element: <ProductDetail />,
        loader: async ({ params }) => {
          return fetch(
            `https://dummyjson.com/products/${params.resid}`
          ).then((res) => res.json());
        },
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "ordersummary",
        element: <OrderSummary />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
