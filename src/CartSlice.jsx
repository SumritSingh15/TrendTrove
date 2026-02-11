import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "Cart",
    initialState: {
        items: [],
    },
    reducers: {
        addproduct: (state, action) => {
            const item = action.payload;
            const existing = state.items.find(i => i.id === item.id)
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...item, quantity: 1 })
            }
        },
        removeProduct: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload)

        },
        decreaseQty: (state, action) => {
            const existing = state.items.find(i => i.id === action.payload)
            if (existing && existing.quantity > 1) {
                existing.quantity -= 1;
            } else if (existing && existing.quantity == 1) {
                state.items = state.items.filter((item) => item.id !== action.payload)
            }
        }
    }
})
export const { addproduct, removeProduct, decreaseQty } = cartSlice.actions;
export default cartSlice.reducer;