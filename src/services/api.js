import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Backend base URL'i

// Deneme Silinecek unutma
// export const getBooks = () => axios.get(`${API_BASE_URL}/api/v1/books`);
// export const addBook = (book) => axios.post(`${API_BASE_URL}/books`, book);
// export const updateBook = (id, book) => axios.put(`${API_BASE_URL}/books/${id}`, book);
// export const deleteBook = (id) => axios.delete(`${API_BASE_URL}/books/${id}`);

// // Authors Endpoints
// export const getAuthors = () => axios.get(`${API_BASE_URL}/api/v1/authors`);
// export const addAuthor = (author) => axios.post(`${API_BASE_URL}/api/v1/authors`, author);
// export const deleteAuthor = (id) => axios.delete(`${API_BASE_URL}/api/v1/authors/${id}`);


export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
  });