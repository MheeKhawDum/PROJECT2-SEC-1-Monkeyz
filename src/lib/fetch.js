const url = import.meta.env.VITE_BASE_URL


async function getMenu(path) {
    try {
        const res = await fetch(`${url}/${path}`)
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

async function getItems(url) {
    try {
      const data = await fetch(url)
      const items = await data.json()
      return items
    } catch (error) {
      console.log(`error: ${error}`)
      throw new Error(error)
    }
  }


async function deleteOrder() {

}

async function editOrder() {

}


async function addOrder() {

}

export { getMenu, getItems, deleteOrder, editOrder, addOrder }