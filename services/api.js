import axios from "axios";

//export const API_URL = "https://sevya-admin.site:8808/api";
// export const API_URL = "http://3.227.60.242:8808/api";
export const WS_URL = "wss://sevya-admin.site:8808"

 export const API_URL = "https://sevya-admin.site:8808/api";
 // export const WS_URL = "ws://localhost:8800"


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
    const fileData = {
      uri: file.uri,
      type: file.type || "image/jpeg", // Ensure you specify the MIME type
      name: file.name || `image_${Date.now()}.jpg`, // Ensure the file has a name
  };
    const formData = new FormData();
    // formData.append("image", fileData); // Append the file with a name
    formData.append("image", file, file.name);  // Append the file with a name

    console.log("File type:", file); // This will log the MIME type of the file (e.g., image/jpeg, image/png)

    try {
      const response = await axios.post(`${API_URL}/auth/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // This tells axios to set the correct Content-Type for file uploads
        },
      });
  
      if (response.status === 200) {
        const imageUrl = response.data.imageUrl; // Assuming the response returns { imageUrl }
        return { success: true, imageUrl };
      } else {
        throw new Error(response.data.error || "Upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };
  