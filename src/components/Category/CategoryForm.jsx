import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const CategoryForm = () => {
  // Form state'i - API yapısıyla birebir uyumlu
  const [formData, setFormData] = useState({
    id: 0,          // POST'ta backend otomatik atayacak ama yine de formda tutuyoruz
    name: '',
    description: ''
  });

  // Router'dan gelen parametreler
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id; // Düzenleme modu kontrolü

  // Düzenleme modunda veriyi çek
  useEffect(() => {
    if (isEditMode) {
      api.get(`/categories/${id}`)
        .then(res => {
          // API'den gelen veriyi form state'ine aktar
          setFormData({
            id: res.data.id,
            name: res.data.name,
            description: res.data.description
          });
        })
        .catch(() => toast.error('Kategori bilgisi alınamadı!'));
    }
  }, [id]);

  // Form gönderim işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API isteği için payload
      const payload = {
        id: formData.id,
        name: formData.name,
        description: formData.description
      };

      if (isEditMode){
        // PUT isteği için id'yi URL'de kullandım
        const response = await api.put(`/categories/${formData.id}`, payload);

        if (response.status === 200){
            toast.success('Güncelleme başarılı!');
            navigate('/categories');
        }
      }else{
        // POST isteği
        const response = await api.post('/categories', payload);

        if(response.status === 201){
            toast.success('Kategori Eklendi!');
            navigate('/categories');
        }
      }
    } catch (error) {
        console.error('İşlem hatası detay:', error);
        toast.error(`Hata: ${error.response?.data?.message || error.message}`);
    }
  };

  // Input değişikliklerini yakala
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-container">
      <h2>{isEditMode ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* ID alanı (sadece düzenleme modunda göster) */}
        {isEditMode && (
          <div className="form-group">
            <label>Kategori ID</label>
            <input
              type="text"
              value={formData.id}
              readOnly
              disabled
            />
          </div>
        )}

        {/* Zorunlu alan: Kategori Adı */}
        <div className="form-group">
          <label>Kategori Adı*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Örn: Bilim Kurgu"
          />
        </div>

        {/* Opsiyonel alan: Açıklama */}
        <div className="form-group">
          <label>Açıklama</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Kategori açıklaması (isteğe bağlı)"
          />
        </div>

        {/* Form aksiyon butonları */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/categories')}
            className="cancel-btn"
          >
            İptal
          </button>
          <button 
            type="submit" 
            className="submit-btn"
          >
            {isEditMode ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;