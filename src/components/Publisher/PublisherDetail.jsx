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
        const response = await api.get(`/publishers/${id}?_embed=books`);
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
    <div className="detail-wrapper">
      <div className="detail-header">
        <h1>{publisher.name}</h1>
        <div className="detail-buttons">
          <button 
          onClick={() => navigate(`/publishers/edit/${id}`)}
          className='submit-btn'
          >Düzenle</button>
          <button 
          onClick={() => navigate('/publishers')}
          className='cancel-btn'>Listeye Dön</button>
        </div>
      </div>
      <div className="detail-content-grid">
        <div className="detail-card">
          <h2>Genel Bilgiler</h2>
          <p><strong>ID:</strong> {publisher.id}</p>
          <p><strong>Yayın Yılı:</strong> {publisher.establishmentYear}</p>
          <p><strong>Stok:</strong> {publisher.address}</p>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="publisher-detail">
  //     <h1>Yayınevi Detayları</h1>
      
  //     <div className="detail-card">
  //       <div className="detail-row">
  //         <span className="detail-label">ID:</span>
  //         <span>{publisher.id}</span>
  //       </div>
  //       <div className="detail-row">
  //         <span className="detail-label">Adı:</span>
  //         <span>{publisher.name}</span>
  //       </div>
  //       <div className="detail-row">
  //         <span className="detail-label">Kuruluş Yıddlı:</span>
  //         <span>{publisher.establishmentYear}</span>
  //       </div>
  //       <div className="detail-row">
  //         <span className="detail-label">Adres:</span>
  //         <span>{publisher.address || '-'}</span>
  //       </div>
  //     </div>

  //     <div className="action-buttons">
  //       <button 
  //         onClick={() => navigate(`/publishers/edit/${id}`)}
  //         className="edit-button"
  //       >
  //         Düzenle
  //       </button>
  //       <button 
  //         onClick={() => navigate('/publishers')}
  //         className="back-button"
  //       >
  //         Listeye Dön
  //       </button>
  //     </div>
  //   </div>
  // );
};

export default PublisherDetail;