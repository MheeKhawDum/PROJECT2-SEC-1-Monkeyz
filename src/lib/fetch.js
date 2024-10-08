const url = import.meta.env.VITE_BASE_URL


async function getList(path) {
    try {
        const res = await fetch(`${url}${path}`)
        if (!res.ok) {
            throw new Error("Failed to fetch data")
        }
        const data = await res.json()
        return { resCode: res.status, data: data }
    } catch (error) {
        console.error("Error fetching data:", error)
        throw error
    }
}

export { getList }