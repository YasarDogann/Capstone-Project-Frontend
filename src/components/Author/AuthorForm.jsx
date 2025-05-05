// CREATE / UPDATE
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const AuthorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '2025-04-30', // Varsayılan değer
    country: ''
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Edit modunda veriyi çek
  useEffect(() => {
    if (isEditMode) {
      api.get(`/authors/${id}`)
        .then(res => setFormData(res.data))
        .catch(() => toast.error('Yazar bilgisi alınamadı'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        birthDate: formData.birthDate,
        country: formData.country
      };

      if (isEditMode) {
        await api.put(`/authors/${id}`, payload);
        toast.success('Yazar başarıyla güncellendi!');
      } else {
        await api.post('/authors', payload);
        toast.success('Yazar başarıyla eklendi!');
      }
      navigate('/authors');
    } catch (error) {
      toast.error(`Hata: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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