import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const PublisherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publisher, setPublisher] = useState(null);
  const [loading, setLoading] = useState(true);

  // Yayınevi detaylarını çek
  useEffect(() => {
    const fetchPublisher = async () => {
      try {
        const response = await api.get(`/publishers/${id}`);
        setPublisher(response.data);
      } catch (error) {
        toast.error('Yayınevi bilgisi alınamadı');
        console.error('Fetch error:', error);
        navigate('/publishers'); // Hata durumunda listeye yönlendir
      } finally {
        setLoading(false);
      }
    };

    fetchPublisher();
  }, [id]);

  if (loading) return <div className="loading-spinner">Yükleniyor...</div>;
  if (!publisher) return <div>Yayınevi bulunamadı</div>;

  return (
    <div className="publisher-detail">
      <h1>Yayınevi Detayları</h1>
      
      <div className="detail-card">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span>{publisher.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Adı:</span>
          <span>{publisher.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Kuruluş Yılı:</span>
          <span>{publisher.establishmentYear}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Adres:</span>
          <span>{publisher.address || '-'}</span>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          onClick={() => navigate(`/publishers/edit/${id}`)}
          className="edit-button"
        >
          Düzenle
        </button>
        <button 
          onClick={() => navigate('/publishers')}
          className="back-button"
        >
          Listeye Dön
        </button>
      </div>
    </div>
  );
};

export default PublisherDetail;