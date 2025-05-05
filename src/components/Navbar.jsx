import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 

const Navbar = () => {
  return (
    // Navigation bar container
    <nav className="navbar">
      <ul>
        <li><Link to="/">Anasayfa</Link></li>
        <li><Link to="/publishers">Yayınevi</Link></li>
        <li><Link to="/categories">Kategori</Link></li>
        <li><Link to="/books">Kitaplar</Link></li>
        <li><Link to="/authors">Yazarlar</Link></li>
        <li><Link to="/borrowings">Ödünç Verilen Kitap</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar; // Exporting the Navbar component to be used in other parts of the application
