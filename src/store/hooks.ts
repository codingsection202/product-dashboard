import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "./store"

// Pre-typed versions so we get autocomplete + type-safety everywhere.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()