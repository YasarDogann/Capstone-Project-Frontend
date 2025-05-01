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
  const [searchId, setSearchId] = useState('');

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

  // ID ile arama yap
  const handleSearchById = async () => {
    if (!searchId) return fetchPublishers();
    
    try {
      const response = await api.get(`/publishers/${searchId}`);
      setPublishers([response.data]); // Tek sonuç göster
    } catch (error) {
      toast.error('Yayınevi bulunamadı');
      console.error('Search error:', error);
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

  if (loading) return <div className="loading-spinner">Yükleniyor...</div>;

  return (
    <div className="publisher-list">
      <div className="list-header">
        <h1>Yayınevi Listesi</h1>
        <Link to="/publishers/new" className="add-button">
          + Yeni Yayınevi
        </Link>
      </div>

      {/* Arama Çubuğu Eklendi */}
      <div className="search-container">
        <input
          type="text"
          placeholder="ID ile ara..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearchById()}
        />
        <button onClick={handleSearchById}>Ara</button>
        <button onClick={fetchPublishers}>Tümünü Göster</button>
      </div>

      <table>
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
          {publishers.map(publisher => (
            <tr key={publisher.id}>
              <td>{publisher.id}</td>
              {/* Düzeltme: publisher.className -> publisher.name */}
              <td>
                <Link to={`/publishers/detail/${publisher.id}`} className="detail-link">
                  {publisher.name}
                </Link>
              </td>
              <td>{publisher.establishmentYear}</td>
              <td>{publisher.address || '-'}</td>
              <td className="actions">
                <Link
                  to={`/publishers/edit/${publisher.id}`}
                  className="edit-link"
                >
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(publisher.id)}
                  className={`delete-btn ${
                    deletingId === publisher.id ? 'deleting' : ''
                  }`}
                  disabled={deletingId === publisher.id}
                >
                  {deletingId === publisher.id ? 'Siliniyor...' : 'Sil'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PublisherList;