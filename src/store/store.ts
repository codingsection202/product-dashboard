import { configureStore } from "@reduxjs/toolkit"
import productsReducer from "./productsSlice"
import favouritesReducer from "./favouritesSlice"

export const store = configureStore({
  reducer: {
    products: productsReducer, // state.products is managed by our slice
    favourites: favouritesReducer,
  },
})

// These types are INFERRED from the store — no manual typing needed.
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch