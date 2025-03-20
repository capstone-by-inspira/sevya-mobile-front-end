import axios from "axios";

const API_URL = "http://10.0.0.240:8800/api";

const apiRequest = async (method, endpoint, data = {}, token = "") => {
  try {
    const request = {
      method,
      url: `${API_URL}/document/${endpoint}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };

    if (method !== "GET") {
      request.data = data;
    }
    const response = await axios(request);
    return { success: true, data: response.data };
  } catch (error) {
    // console.error("API Error:", error.response ? error.response.data : error.message);
    return {
      success: false,
      error:
        error.response?.data?.error || error.message || "Something went wrong",
    };
  }
};

// Create a new document in any Firestore collection
export const createDocument = (collection, data, token) =>
  apiRequest("POST", collection, data, token);

// Read all documents from a collection
export const getDocuments = (collection, token) =>
  apiRequest("GET", collection, {}, token);

// Read a single document by ID
export const getDocumentById = (collection, id, token) =>
  apiRequest("GET", `${collection}/${id}`, {}, token);

// Read all documents by Key-Value
export const getDocumentByKeyValue = (collection, key, value, token) => {
  return apiRequest(
    "GET",
    `${collection}/query?key=${encodeURIComponent(
      key
    )}&value=${encodeURIComponent(value)}`,
    {},
    token
  );
};

// Update a document by ID
export const updateDocument = (collection, id, data, token) =>
  apiRequest("PUT", `${collection}/${id}`, data, token);

// Delete a document by ID
export const deleteDocument = (collection, id, token) =>
  apiRequest("DELETE", `${collection}/${id}`, {}, token);
