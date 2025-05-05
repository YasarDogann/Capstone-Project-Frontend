// READ / DELETE
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const PublisherList = () => {
  // State'ler
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  

  // Yayınevlerini çek
  const fetchPublishers = async () => {
    try {
      const response = await api.get('/publishers');
      setPublishers(response.data);
    } catch (error) {
      toast.error('Yayınevleri yüklenemedi');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Yayınevi silme
  const handleDelete = async (id) => {
    if (window.confirm('Bu yayıneviyi silmek istediğinize emin misiniz?')) {
      setDeletingId(id);
      try {
        const response = await api.delete(`/publishers/${id}`);
        
        if (response.status === 200) {
          toast.success('Yayınevi silindi!');
          fetchPublishers();
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Silme işlemi başarısız';
        toast.error(errorMsg);
        
        // Kitaplar varsa özel uyarı
        if (errorMsg.includes('kitap mevcut')) {
          toast.info('Önce bu yayınevine ait kitapları silmelisiniz');
        }
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Bileşen yüklendiğinde verileri çek
  useEffect(() => {
    fetchPublishers();
  }, []);

  const publisherss = publishers.filter(publisher =>
    publisher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    publisher.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-spinner">Yükleniyor...</div>;

  return (
    <div className="table-list-container">
      <div className="header">
        <h1>Yayınevi Listesi</h1>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Yayınevi ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <Link to="/publishers/new" className="add-button">
            <span>+</span> Yeni Yayınevi Ekle
          </Link>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Adı</th>
              <th>Kuruluş Yılı</th>
              <th>Adres</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {publisherss.map(publisher => (
              <tr key={publisher.id}>
                <td data-label="ID">{publisher.id}</td>
                <td data-label="Yayınevi Adı">
                  <Link to={`/publishers/detail/${publisher.id}`} className='publisher-link'>
                  {publisher.name}
                  </Link>
                </td>
                <td>{publisher.establishmentYear}</td>
                <td>{publisher.address}</td>
                <td data-label="İşlemler" className="actions">
                  <Link to={`/publishers/edit/${publisher.id}`} className="action-btn edit">
                    <svg viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </Link>
                  <button 
                    onClick={() => handleDelete(publisher.id)} className="action-btn delete">
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
  );
};

export default PublisherList;