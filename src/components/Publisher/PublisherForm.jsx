// CREATE / UPDATE
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const PublisherForm = () => {
  // Form state'i - API yapısıyla birebir uyumlu
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    establishmentYear: new Date().getFullYear(), // Varsayılan: mevcut yıl
    address: ''
  });

  // Router'dan gelen parametreler
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id; // Düzenleme modu kontrolü

  // Düzenleme modunda veriyi çek
  useEffect(() => {
    const fetchPublisher = async () => {
      try {
        const response = await api.get(`/publishers/${id}`);
        setFormData(response.data);
      } catch (error) {
        toast.error('Yayınevi bilgisi alınamadı');
        console.error('Fetch error:', error);
      }
    };

    if (isEditMode) fetchPublisher();
  }, [id]);

  // Form gönderim işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        establishmentYear: formData.establishmentYear,
        address: formData.address
      };

      if (isEditMode) {
        await api.put(`/publishers/${id}`, payload);
        toast.success('Yayınevi başarıyla güncellendi!');
      } else {
        await api.post('/publishers', payload);
        toast.success('Yayınevi başarıyla eklendi!');
      }
      navigate('/publishers');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'İşlem başarısız';
      toast.error(errorMsg);
      console.error('Submission error:', error);
    }
  };

  // Input değişikliklerini yakala
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'establishmentYear' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="form-container">
      <h2>{isEditMode ? 'Yayınevi Düzenle' : 'Yeni Yayınevi Ekle'}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* ID alanı (sadece düzenleme modunda) */}
        {isEditMode && (
          <div className="form-group">
            <label>Yayınevi ID</label>
            <input 
              type="text" 
              value={formData.id} 
              disabled 
            />
          </div>
        )}

        {/* Zorunlu alan: Yayınevi Adı */}
        <div className="form-group">
          <label>Yayınevi Adı*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Örn: Can Yayınları"
          />
        </div>

        {/* Kuruluş Yılı */}
        <div className="form-group">
          <label>Kuruluş Yılı*</label>
          <input
            type="number"
            name="establishmentYear"
            min="1900"
            max={new Date().getFullYear()}
            value={formData.establishmentYear}
            onChange={handleChange}
            required
          />
        </div>

        {/* Adres */}
        <div className="form-group">
          <label>Adres</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            placeholder="Yayınevinin fiziksel adresi"
          />
        </div>

        {/* Form aksiyon butonları */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/publishers')}
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

export default PublisherForm;