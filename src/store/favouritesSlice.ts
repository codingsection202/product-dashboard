import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

const STORAGE_KEY = "favourites"

function loadFavourites(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as number[]) : []
  } catch {
    return []
  }
}

interface FavouritesState {
  ids: number[]
}

const initialState: FavouritesState = {
  ids: loadFavourites(),
}

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    toggleFavourite(state, action: PayloadAction<number>) {
      const id = action.payload
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id) // remove
      } else {
        state.ids.push(id) // add
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids)) // persist
    },
  },
})

export const { toggleFavourite } = favouritesSlice.actions
export default favouritesSlice.reducer