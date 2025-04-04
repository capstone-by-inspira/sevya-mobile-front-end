import * as FileSystem from 'expo-file-system';
import { app } from '@/config/firebase';
import { createDocument } from './api';
import { getSecureData } from './secureStorage';



export const capitalize = (word)  => {
    if (!word) return "";
    return word
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

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
export function formatLocalDateTime(dateString) {
    const date = new Date(dateString);

    // Get local date and time
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    };

    return date.toLocaleString('en-US', options);
}

export function formatLocalDate(dateString){

    const date = new Date(dateString); // March 8, 2025

    const day = date.getDate(); // 8
    const month = date.toLocaleString('default', { month: 'long' }); // "March"
    const year = date.getFullYear(); // 2025
    const dayName = date.toLocaleString('default', { weekday: 'long' }); // "Saturday" (Note: March 8, 2025 is actually a Saturday)
    
    const formattedDate = `${day} ${month} ${year} (${dayName})`;
    return formattedDate;

}
// Example usage
const timestamp = "2025-03-21T17:27:01-07:00"; // Input timestamp
console.log(formatLocalDateTime(timestamp));


export const sendNotification = async (title, body, createdBy, token) =>{
    const data ={
        title: title,
        body: body,
        createdBy: createdBy

    }
    const res = await createDocument(
        "notificationsWeb",
        data,
        token
      )
    
    console.log(res, 'notification-created');


} 

