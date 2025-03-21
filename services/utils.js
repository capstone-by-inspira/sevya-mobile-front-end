import * as FileSystem from 'expo-file-system';


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

export const uriToFile = async (uri, fileName) => {
    // Fetch the file from the URI
    const response = await fetch(uri);
    const blob = await response.blob();
  
    // Create a File object
    const file = new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  
    return file;
  };