// CREATE / UPDATE
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const AuthorForm = () => {
  // Form verilerini tutan state başlangıç değeri ile
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '2025-04-30', // Varsayılan değer
    country: ''
  });
  const { id } = useParams(); // URL'den id parametresini al
  const navigate = useNavigate();
  const isEditMode = !!id; // Düzenleme modunda olup olmadığını kontrol eden flag

  // Düzenleme modunda ise mevcut yazar bilgilerini çek
  useEffect(() => {
    if (isEditMode) {
      api.get(`/authors/${id}`)
        .then(res => setFormData(res.data)) // API'den gelen veriyi state'e ata
        .catch(() => toast.error('Yazar bilgisi alınamadı')); // Hata durumunda bildirim göster
    }
  }, [id]); // id değiştiğinde bu efekt yeniden çalışsın

  // Form submit işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API'ye gönderilecek veri objesi
      const payload = {
        name: formData.name,
        birthDate: formData.birthDate,
        country: formData.country
      };

      // Düzenleme modunda ise PUT, yoksa POST isteği yap
      if (isEditMode) {
        await api.put(`/authors/${id}`, payload);
        toast.success('Yazar başarıyla güncellendi!');
      } else {
        await api.post('/authors', payload);
        toast.success('Yazar başarıyla eklendi!');
      }
      navigate('/authors'); // İşlem başarılıysa yazar listesine yönlendir
    } catch (error) {
      toast.error(`Hata: ${error.response?.data?.message || error.message}`); // Hata mesajını kullanıcıya göster (API'den gelen veya genel hata mesajı)
    }
  };

  // Input değişikliklerini handle eden fonksiyon
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Ana render kısmı
  return (
    <div className="form-container">
      <h2>{isEditMode ? 'Yazar Düzenle' : 'Yeni Yazar Ekle'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Yazar Adı*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Örn: Yaşar Kemal"
          />
        </div>

        <div className="form-group">
          <label>Doğum Tarihi*</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ülke*</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            placeholder="Örn: Türkiye"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/authors')}
            className="cancel-btn">
            İptal
          </button>
          <button 
          type="submit"  
          className="submit-btn">
            {isEditMode ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthorForm;