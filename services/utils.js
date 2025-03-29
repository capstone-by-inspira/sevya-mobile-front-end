import * as FileSystem from 'expo-file-system';
import { app } from '@/config/firebase';
import { createDocument } from './api';
import { getSecureData } from './secureStorage';





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
        "notifications",
        data,
        token
      )
      console.log(res, 'notification-created');


} 

