// READ / DELETE
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAuthors = async () => {
    try {
      const res = await api.get('/authors');
      setAuthors(res.data);
    } catch (error) {
      toast.error('Yazarlar yüklenemedi: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu yazarı silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/authors/${id}`);
        toast.success('Yazar silindi');
        fetchAuthors();
      } catch (error) {
        toast.error('Silme hatası: ' + error.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="table-list-container">
      <div className="header">
        <h1>Yazar Listesi</h1>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Yazar ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <Link to="/authors/new" className="add-button">
            <span>+</span> Yeni Yazar Ekle
          </Link>
        </div>
      </div>

      <div className="table-wrapper">
        <table className='modern-table'>
          <thead>
          <tr>
             <th>ID</th>
             <th>Adı</th>
             <th>Doğum Tarihi</th>
             <th>Ülke</th>
             <th>İşlemler</th>
           </tr>
          </thead>
          <tbody>
            {filteredAuthors.map(author => (
              <tr key={author.id}>
                <td data-label="ID">{author.id}</td>
                <td data-label="Yazar Adı">
                  <Link to={`/authors/detail/${author.id}`}
                  className="author-link">
                    {author.name}
                  </Link>
                </td>
                <td>{author.birthDate}</td>
                <td>{author.country}</td>
                <td data-label="İşlemler" className="actions">
                  <Link to={`/authors/edit/${author.id}`} className="action-btn edit">
                    <svg viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </Link>
                  <button onClick={() => handleDelete(author.id)} className="action-btn delete">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>






  //   <div className="author-list-container">
  //     <div className="header">
  //       <h1>Yazar Listesi</h1>
  //       <Link to="/authors/new" className="add-button">
  //         + Yeni Yazar
  //       </Link>
  //     </div>

  //     <div className="search-bar">
  //       <input
  //         type="text"
  //         placeholder="Yazar ara..."
  //         value={searchTerm}
  //         onChange={(e) => setSearchTerm(e.target.value)}
  //       />
  //     </div>

  //     <table>
  //       <thead>
  //         <tr>
  //           <th>ID</th>
  //           <th>Adı</th>
  //           <th>Doğum Tarihi</th>
  //           <th>Ülke</th>
  //           <th>İşlemler</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {filteredAuthors.length > 0 ? (
  //           filteredAuthors.map(author => (
  //             <tr key={author.id}>
  //               <td>{author.id}</td>
  //               <td>{author.name}</td>
  //               <td>{author.birthDate}</td>
  //               <td>{author.country}</td>
  //               <td className="actions">
  //                 <Link
  //                   to={`/authors/edit/${author.id}`}
  //                   className="edit-link"
  //                 >
  //                   Düzenle
  //                 </Link>
  //                 <button
  //                   onClick={() => handleDelete(author.id)}
  //                   className="delete-button"
  //                 >
  //                   Sil
  //                 </button>
  //               </td>
  //             </tr>
  //           ))
  //         ) : (
  //           <tr>
  //             <td colSpan="5" className="no-data">
  //               {searchTerm ? 'Sonuç bulunamadı' : 'Kayıtlı yazar yok'}
  //             </td>
  //           </tr>
  //         )}
  //       </tbody>
  //     </table>
  //   </div>
  );
};

export default AuthorList;