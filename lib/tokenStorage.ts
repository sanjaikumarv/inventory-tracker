export const tokenStorage = {
    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("inventoryToken")
        }
        return null
    },

    addToken: (token: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("inventoryToken", token)
        }
    },

    clearToken: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem("inventoryToken")
            // Or use localStorage.clear() if you want to clear everything
        }
    }
}
