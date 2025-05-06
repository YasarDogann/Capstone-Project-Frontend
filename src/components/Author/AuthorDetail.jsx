import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const AuthorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        const fetchCategory = async () => {
            try {
                const { data } = await api.get(`/authors/${id}`);
                setAuthor(data);
            } catch (err) {
                toast.error('Yazar bilgileri yüklenemedi');
                console.error('Detay sayfası hatası : ', err);
                navigate('/authors');
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id, navigate]);

    if (loading) return <div className="loading">Yükleniyor...</div>;
    if (!author) return <div className="not-found">Yazar Bulunamadı</div>;

    return (
        <div className="detail-wrapper">
            <div className="detail-header">
                <h1>{author.name}</h1>
                <div className="detail-buttons">
                    <button 
                        onClick={() => navigate(`/authors/edit/${id}`)}
                        className='submit-btn'
                        >Düzenle
                    </button>
                    <button 
                        onClick={() => navigate('/authors')}
                        className='cancel-btn'>Listeye Dön
                    </button>
                </div>
            </div>
            <div className="detail-content-grid">
                <div className="detail-card">
                    <h2>Genel Bilgiler</h2>
                    <p><strong>ID:</strong>{author.id}</p>
                    <p><strong>Adı:</strong>{author.name}</p>
                    <p><strong>Doğum Tarihi:</strong>{author.description}</p>
                    <p><strong>Ülkesi:</strong>{author.country}</p>
                </div>
            </div>
        </div>
    );
};
export default AuthorDetail;