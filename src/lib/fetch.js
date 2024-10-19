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

async function editOrder(orderId, updatedData) {
  try {
    const res = await fetch(`${url}/cart/${orderId}`, {
        method: 'PUT', // ใช้ PUT หรือ PATCH สำหรับการอัปเดต
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData) // ส่งข้อมูลที่อัปเดตใน body
    });

    if (!res.ok) {
        throw new Error("Failed to update the order");
    }

    const data = await res.json();
    return { resCode: res.status, message: 'Order updated successfully', data: data };
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
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

async function getOrders() {
  try {
    const res = await fetch(`${url}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await res.json();
    return data; // ส่งกลับข้อมูลที่ได้จากฐานข้อมูล
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

async function getOrdersbyId(id) {
  try {
    const res = await fetch(`${url}/cart/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await res.json();
    return data; // ส่งกลับข้อมูลที่ได้จากฐานข้อมูล
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9); // สร้าง string ที่เป็น unique id
}

async function addHistory(orderData) {
  try {
      const historyData = {
        id: generateUniqueId(), // สร้าง id สำหรับ order ใหม่
        items: orderData // เก็บข้อมูลทั้งหมดใน array ชื่อ items
      };

      const res = await fetch(`${url}/history`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(historyData) // ส่งข้อมูลในรูปแบบใหม่
      });

      if (!res.ok) {
          throw new Error("Failed to add the order to the history");
      }

      const data = await res.json();
      return { resCode: res.status, message: 'Order added to history successfully', data: data };
  } catch (error) {
      console.error("Error adding order to history:", error);
      throw error;
  }
}


async function getHistory() {
  try {
    const res = await fetch(`${url}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await res.json();
    return data; // ส่งกลับข้อมูลที่ได้จากฐานข้อมูล
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

// ฟังก์ชันอัปเดตออเดอร์ใน backend
async function updateOrder(updatedItem) {
  try {
    const res = await fetch(`${url}/cart/${updatedItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    });

    if (!res.ok) {
      throw new Error("Failed to update the order");
    }

    const data = await res.json();
    return { resCode: res.status, message: "Order updated successfully", data: data };
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

export { getMenu, getItems, deleteOrder, editOrder, addOrder, getOrders ,getOrdersbyId, addHistory, getHistory, updateOrder}