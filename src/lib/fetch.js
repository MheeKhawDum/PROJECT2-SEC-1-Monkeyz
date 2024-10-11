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


  async function deleteOrder(orderId) {
    try {
        const res = await fetch(`${url}/cart/${orderId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error("Failed to delete the order");
        }

        const data = await res.json();
        return { resCode: res.status, message: 'Order deleted successfully', data: data };
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
}

async function editOrder() {

}


async function addOrder(orderData) {
  try {
      const res = await fetch(`${url}/cart`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
      });

      if (!res.ok) {
          throw new Error("Failed to add the order to the cart");
      }

      const data = await res.json();
      return { resCode: res.status, message: 'Order added successfully', data: data };
  } catch (error) {
      console.error("Error adding order:", error);
      throw error;
  }
}

export { getMenu, getItems, deleteOrder, editOrder, addOrder }
