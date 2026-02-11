import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./CartSlice"
const appstore = configureStore({
    reducer: {
        Cart: CartReducer,
    }
})
export default appstore