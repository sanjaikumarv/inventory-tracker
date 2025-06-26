
export interface InventoryItem {
    _id: string
    name: string
    unit: string
    updatedAt: string
    currentQuantity: number
    reorderThreshold: number
    status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK"
    createdAt: string
    category?: string
    cost?: number
}

export interface RestockAlert {
    item: InventoryItem
    daysUntilEmpty: number
    recommendedReorderQuantity: number
    averageDailyConsumption: number
}

export interface InventoryConsumption {
    _id: string
    itemId: InventoryItem
    date: string
    quantity: number
    createdAt: string
    updatedAt: string
    __v: number
}
export type StatusType = "TOTAL" | "LOW_STOCK" | "OUT_OF_STOCK" | "IN_STOCK";


export interface CardOption { heading: string, count: number, des: string, status: StatusType }

export interface RestockAlert {
    item: InventoryItem
    daysUntilEmpty: number
    recommendedReorderQuantity: number
    averageDailyConsumption: number
}