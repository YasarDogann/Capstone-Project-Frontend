import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthorList from './components/Author/AuthorList';
import AuthorForm from './components/Author/AuthorForm';
import CategoryForm from './components/Category/CategoryForm';
import CategoryList from './components/Category/CategoryList';
import CategoryDetail from './components/Category/CategoryDetail';
import PublisherForm from './components/Publisher/PublisherForm';
import PublisherList from './components/Publisher/PublisherList';
import PublisherDetail from './components/Publisher/PublisherDetail';
import BookDetail from './components/Book/BookDetail';
import BookList from './components/Book/BookList';
import BookForm from './components/Book/BookForm';
import BorrowingForm from './components/Borrowing/BorrowingForm';
import BorrowingList from './components/Borrowing/BorrowingList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FooterImage from './components/FooterImage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authors" element={<AuthorList />} />
          <Route path="/authors/new" element={<AuthorForm />} />
          <Route path="/authors/edit/:id" element={<AuthorForm />} />

          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/edit/:id" element={<CategoryForm />} />
          <Route path='/categories/detail/:id' element={<CategoryDetail />} />

          <Route path="/publishers" element={<PublisherList />} />
          <Route path="/publishers/new" element={<PublisherForm />} />
          <Route path="/publishers/edit/:id" element={<PublisherForm />} />
          <Route path="/publishers/detail/:id" element={<PublisherDetail />} />

          <Route path="/books" element={<BookList />} />
          <Route path="/books/new" element={<BookForm />} />
          <Route path="/books/edit/:id" element={<BookForm />} />
          <Route path="/books/detail/:id" element={<BookDetail />} />

          <Route path="/borrowings" element={<BorrowingList />} />
          <Route path="/borrowings/new" element={<BorrowingForm />} />
          <Route path="/borrowings/edit/:id" element={<BorrowingForm />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>  
      <FooterImage />
    </Router>
  );
}
export default App;