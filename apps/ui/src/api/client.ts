import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3333/api', 
});

const dateRegex = /^\d{4}-\d{2}-\d{2}/;

function isIsoDateString(value: any): boolean {
  return (
    typeof value === 'string' &&
    value.length >= 10 &&
    value.length <= 30 &&
    dateRegex.test(value) &&
    !isNaN(Date.parse(value))
  );
}

function handleDates(body: any): any { //gestione date
  if (body === null || body === undefined || typeof body !== 'object') return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) {
      body[key] = new Date(value); 
    } else if (typeof value === 'object') {
      handleDates(value); 
    }
  }
  return body;
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use((response) => {
  handleDates(response.data);
  return response;
});

export default client;