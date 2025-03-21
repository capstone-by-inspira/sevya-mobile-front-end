import axios from "axios";

export const API_URL = "http://3.227.60.242:8808/api";


export const translatePatientNotes = async (patientData) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/translate-notes`,
       {patientData} 
    );

    console.log(response.data, "TRANSLATED");
    return response.data; // Assuming response.data contains translated text
  } catch (error) {
    console.error("Error translating:", error);
    throw new Error("Failed to translate patient notes");
  }
};


  const apiRequest = async (method, endpoint, data = {}, token = "") => {
    
    try {
      const request =  {
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
          error: error.response?.data?.error || error.message || "Something went wrong",
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
    return apiRequest("GET", `${collection}/query?key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`, {}, token);
  };
  
  // Update a document by ID
  export const updateDocument = (collection, id, data, token) =>
    apiRequest("PUT", `${collection}/${id}`, data, token);
  
  // Delete a document by ID
  export const deleteDocument = (collection, id, token) =>
    apiRequest("DELETE", `${collection}/${id}`, {}, token);


  export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file, file.name); // Append the file with a name
  
    try {
      const response = await fetch(`${API_URL}/auth/upload`, {
        method: "POST",
        body: formData,
        headers: {
          // Do not set 'Content-Type' manually; let the browser handle it
        },
      });
  
      const upload_image = await response.json();
      if (!response.ok) {
        throw new Error(upload_image.error || "Upload failed!");
      }
  
      const imageUrl = upload_image.imageUrl;
      return { success: true, imageUrl };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };