import { create } from "zustand"
import { supabase } from "./supabaseClient"

interface IProductsStore {
    products: IProduct[]
    getProducts: () => void
}

export const useProductsStore = create<IProductsStore>((set) => ({
    products: [],
    getProducts: async () => {
        const { data } = await supabase
            .from('products')
            .select('*, images:product_images!inner(id, image_url)')

        if (!data) return

        set({ products: data })
    },
}))