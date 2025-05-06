import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const BorrowingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [borrowing, setBorrowing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const { data } = await api.get(`/borrows/${id}`);
                setBorrowing(data);
            } catch (err) {
                toast.error('Ödünç alan bilgileri yüklenemedi');
                console.error('Detay sayfası hatası:', err);
                navigate('/borrowings');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id, navigate]);

    if (loading) return <div className="loading">Yükleniyor...</div>;
    if (!borrowing) return <div className="not-found">Ödünç Alan Bulunamadı</div>;

    return (
        <div className="detail-wrapper">
            <div className="detail-header">
                <h1>{borrowing.name}</h1>
                <div className="detail-buttons">
                    <button 
                        onClick={() => navigate(`/borrowings/edit/${id}`)}
                        className='submit-btn'
                        >Düzenle
                    </button>
                    <button 
                        onClick={() => navigate('/borrowings')}
                        className='cancel-btn'>Listeye Dön
                    </button>
                </div>
            </div>
            <div className="detail-content-grid">
                <div className="detail-card">
                    <h2>Genel Bilgiler</h2>
                    <p><strong>ID: </strong>{borrowing.id}</p>
                    <p><strong>Ödünç Alan Adı: </strong>{borrowing.borrowerName}</p>
                    <p><strong>Email: </strong>{borrowing.borrowerMail}</p>
                    <p><strong>Alma Tarihi: </strong>{borrowing.borrowingDate}</p>
                    {/* <p><strong>İade Tarihi: </strong>{borrowing.returnDate}</p> */}
                </div>
                <div className="detail-card">
                    <h2>Alınan Kitap Bilgisi</h2>
                    <p><strong>ID: </strong>{borrowing.book.id}</p>
                    <p><strong>Ödünç Alınan Kitap Adı: </strong>{borrowing.book.name}</p>
                    <p><strong>Yayın Tarihi: </strong>{borrowing.book.publicationYear}</p>
                    <p><strong>Yazar Adı: </strong>{borrowing.book.author.name}</p>
                </div>
            </div>
        </div>

    );
};
export default BorrowingDetail;