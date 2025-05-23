import axios from "axios";

//const API_URL = "https://api.kucing.in";
const API_URL = "http://127.0.0.1:3000"; // Change to your backend URL

// -----------------Items-----------------------------
export const fetchItems = async () => {
  const response = await axios.get(`${API_URL}/items`);
  return response.data.data.items;
};

export const fetchItemsById = async () => {
  const response = await axios.get(`${API_URL}/items`);
  return response.data.data.items;
};

export const createItem = async (item) => {
  try {
    const response = await axios.post(`${API_URL}/items`, item);
    
    if (response.status >= 200 && response.status < 300) {
      console.log('Success:', response.data);
      return response.data;
    } else {
      console.error('Unexpected status code:', response.status);
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

export const updateItem = async (id, item) => {
  const response = await axios.put(`${API_URL}/items/${id}`, item);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await axios.delete(`${API_URL}/items/${id}`);
  return response.data;
};

// -----------------Categories-----------------------------

export const fetchCategory = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data.data.categories;
};

export const createCategory = async (category) => {
  const response = await axios.post(`${API_URL}/categories`, category);
  return response.data;
};

export const updateCategory = async (id, category) => {
  const response = await axios.put(`${API_URL}/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/categories/${id}`);
  return response.data;
};

// -----------------Vouchers-----------------------------

export const fetchVouchers = async () => {
  const response = await axios.get(`${API_URL}/vouchers`);
  return response.data.data.vouchers; // Adjust based on your API response structure
};

export const fetchVoucherById = async (id) => {
  const response = await axios.get(`${API_URL}/vouchers/${id}`);
  return response.data.data.voucher; // Adjust based on your API response structure
};

export const createVoucher = async (voucher) => {
  const response = await axios.post(`${API_URL}/vouchers`, voucher);
  console.log(response.data);
  return response.data;
};

export const updateVoucher = async (id, voucher) => {
  const response = await axios.put(`${API_URL}/vouchers/${id}`, voucher);
  return response.data;
};

export const deleteVoucher = async (id) => {
  const response = await axios.delete(`${API_URL}/vouchers/${id}`);
  return response.data;
};

// -----------------Articles-----------------------------

export const fetchArticles = async () => {
  const response = await axios.get(`${API_URL}/articles`);
  return response.data.data.articles; // Adjust based on your API response structure
};

export const fetchArticleById = async (id) => {
  const response = await axios.get(`${API_URL}/articles/${id}`);
  return response.data.data.article; // Adjust based on your API response structure
};

export const createArticle = async (article) => {
  const response = await axios.post(`${API_URL}/articles`, article);
  console.log(response.data);
  return response.data;
};

export const updateArticle = async (id, article) => {
  const response = await axios.put(`${API_URL}/articles/${id}`, article);
  return response.data;
};

export const deleteArticle = async (id) => {
  const response = await axios.delete(`${API_URL}/articles/${id}`);
  return response.data;
};

// -----------------Orders-----------------------------

export const fetchOrders = async () => {
  const response = await axios.get(`${API_URL}/ordersadmin`);
  return response.data.orders; // Adjust based on your API response structure
};

export const updateOrder = async (id, order) => {
  const response = await axios.put(`${API_URL}/orders/${id}`, order);
  return response.data;
};

export const updateOrderAWB = async (id, awb) => {
  const response = await axios.put(`${API_URL}/ordersawb/${id}`, awb);
  return response.data;
};

export const updateOrderStatus = async (id, awb) => {
  const response = await axios.put(`${API_URL}/ordersstatus/${id}`, awb);
  console.log(response.data);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(`${API_URL}/orders/${id}`);
  return response.data;
};

// -----------------Orders-----------------------------

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/usersadmin`);
  return response.data.data.users;
};

// -----------------Admins-----------------------------

export const getAdmins = async () => {
  const response = await axios.get(`${API_URL}/adminsall`);
  return response.data.data.admin;
};

export const postLoginAdmins = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/admins/login`, {
      username,
      password,
    });
    return response.data;
  } catch {
    return null;
  }
};

export const deleteAdmins = async (id) => {
  const response = await axios.delete(`${API_URL}/admins/${id}`);
  return response;
}

export const updateAdmins = async (id, data) => {
  const response = await axios.put(`${API_URL}/admins/${id}`, data);
  return response;
}

export const createAdmin = async (data) => {
  const response = await axios.post(`${API_URL}/admins`, data);
  return response;
}

export const getAdminById = async (id) => {
  const response = await axios.get(`${API_URL}/admins/${id}`);
  return response.data.data.admin;
}

export const getAdminByUsername = async (username) => {
  const response = await axios.get(`${API_URL}/admins/username/${username}`);
  return response.data.data.admin;
}