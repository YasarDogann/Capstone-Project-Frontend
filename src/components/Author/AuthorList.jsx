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
    <div className="author-list-container">
      <div className="list-header">
        <h1>Yazar Listesi</h1>
        <Link to="/authors/new" className="add-button">
          + Yeni Yazar
        </Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Yazar ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
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
          {filteredAuthors.length > 0 ? (
            filteredAuthors.map(author => (
              <tr key={author.id}>
                <td>{author.id}</td>
                <td>{author.name}</td>
                <td>{author.birthDate}</td>
                <td>{author.country}</td>
                <td className="actions">
                  <Link
                    to={`/authors/edit/${author.id}`}
                    className="edit-link"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="delete-button"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">
                {searchTerm ? 'Sonuç bulunamadı' : 'Kayıtlı yazar yok'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuthorList;