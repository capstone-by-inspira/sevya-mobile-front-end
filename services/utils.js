import * as FileSystem from 'expo-file-system';
import { app } from '@/config/firebase';


export const formatTimestamp = (timestamp, timeZone = "UTC") => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone, // Default to UTC, can be changed
    });
};
export const formatDateOnly = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};
export const formatTimeOnly = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
};


export const uriToFile = async (uri) => {
    try {
      // Get file info (to retrieve the size and MIME type)
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error("File does not exist");
  
      // Read the file as a Blob
      const fileData = await fetch(uri);
      const blob = await fileData.blob();
  
      // Create a File object
      const file = new File([blob], "image.jpg", {
        type: "image/jpeg", // Modify based on actual MIME type
        lastModified: fileInfo.modificationTime * 1000, // Convert to milliseconds
      });
  
      // Add lastModifiedDate property to File object
      file.lastModifiedDate = new Date(fileInfo.modificationTime * 1000);
  
      return file;
    } catch (error) {
      console.error("Error converting URI to File:", error);
      return null;
    }
  };
  

  

export const formatDateAndMonthOnly = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
    });
};

export const formatShiftTimeOnly = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
};

export const getBlobFromUri = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
  
      const filename = image.substring(image.lastIndexOf('/') + 1);
      const ref = app.storage().ref().child(filename);
      await ref.put(blob);
      console.log(ref);
      const snapshot = await ref.put(blob);
      blob.close();
  };
