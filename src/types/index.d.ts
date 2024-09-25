declare type IProduct = {
    id: int
    name: string
    price: number
    description: string
    image_url: string
    is_stackable: boolean
    model_path: string
    source: string
    category_id: int
    created_at: string
    updated_at: string
}

declare type IProductImage = {
    id: int
    image_url: string
}