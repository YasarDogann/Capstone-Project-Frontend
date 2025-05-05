import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const CatgoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const { data } = await api.get(`/categories/${id}`);
                setCategory(data);
            } catch (err) {
                toast.error('Kategori bilgileri yüklenemedi');
                console.error('Detay sayfası hatası : ', err);
                navigate('/categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id, navigate]);

    if (loading) return <div className="loading">Yükleniyor...</div>;
    if (!category) return <div className="not-found">Kategori Bulunamadı</div>;

    return (
        <div className="detail-wrapper">
            <div className="detail-header">
                <h1>{category.name}</h1>
                <div className="detail-buttons">
                    <button 
                        onClick={() => navigate(`/categories/edit/${id}`)}
                        className='submit-btn'
                        >Düzenle
                    </button>
                    <button 
                        onClick={() => navigate('/categories')}
                        className='cancel-btn'>Listeye Dön
                    </button>
                </div>
            </div>

            <div className="detail-content-grid">
                <div className="detail-card">
                    <h2>Genel Bilgiler</h2>
                    <p><strong>ID:</strong>{category.id}</p>
                    <p><strong>Adı:</strong>{category.name}</p>
                    <p><strong>Açıklama:</strong>{category.description}</p>
                </div>
            </div>
        </div>       
    );
};

export default CatgoryDetail;