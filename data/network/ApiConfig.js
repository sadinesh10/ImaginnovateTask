import axios from "axios";

export const base_url = 'http://192.168.1.54:3001/';
export const instance = axios.create({
    baseURL: base_url,
  
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  });