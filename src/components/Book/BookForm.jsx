import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

// Kitap formu için başlangıç verileri tanımlanıyor
const BookForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    publicationYear: new Date().getFullYear(),
    stock: 0,
    author: { id: 0, name: '', birthDate: '', country: '' },
    publisher: { id: 0, name: '', establishmentYear: 0, address: '' },
    categories: []
  });

  // Yazarlar, yayınevleri ve kategoriler için state'ler
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const { id } = useParams(); // URL'den kitap ID'si alınır
  const navigate = useNavigate();
  const isEditMode = !!id; // Düzenleme modu mu kontrol et

  // Sayfa yüklendiğinde gerekli veriler çekilir
  useEffect(() => {
    const fetchData = async () => {
      try {
         // Yazarlar, yayınevleri ve kategoriler paralel olarak getirilir
        const [authorsRes, publishersRes, categoriesRes] = await Promise.all([
          api.get('/authors'),
          api.get('/publishers'),
          api.get('/categories')
        ]);

        // Çekilen veriler state'e aktarılır
        setAuthors(authorsRes.data);
        setPublishers(publishersRes.data);
        setAllCategories(categoriesRes.data);

        // Eğer düzenleme modundaysa kitap verileri de çekilir
        if (isEditMode) {
          const { data } = await api.get(`/books/${id}?_expand=author,publisher&_embed=categories`);
          setFormData({
            ...data,
            categories: data.categories || []
          });
        }
      } catch (error) {
        toast.error('Veri yükleme hatası');
        console.error(error);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  // Form gönderildiğinde çalışan fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sunucuya gönderilecek veri hazırlanır
      const payload = {
        ...formData,
        authorId: formData.author.id,
        publisherId: formData.publisher.id,
        categoryIds: formData.categories.map(c => c.id)
      };

      // Yeni kitap ekleme ya da var olanı güncelleme
      if (isEditMode) {
        await api.put(`/books/${id}`, payload);
        toast.success('Kitap güncellendi!');
      } else {
        await api.post('/books', payload);
        toast.success('Kitap eklendi!');
      }
      navigate('/books'); // Başarılı işlemden sonra kitaplar sayfasına yönlendirilir
    } catch (error) {
      toast.error(error.response?.data?.message || 'İşlem başarısız');
      console.error(error);
    }
  };

  // Form alanı değişikliklerini yönetir
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   // Yazar seçimi değiştiğinde çağrılır
  const handleAuthorChange = (e) => {
    const author = authors.find(a => a.id === Number(e.target.value)) || { id: 0 };
    setFormData({ ...formData, author });
  };

  // Yayınevi seçimi değiştiğinde çağrılır
  const handlePublisherChange = (e) => {
    const publisher = publishers.find(p => p.id === Number(e.target.value)) || { id: 0 };
    setFormData({ ...formData, publisher });
  };

  // Kategori seçimi değiştirildiğinde çalışır
  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => {
      const exists = prev.categories.some(c => c.id === categoryId);
      const category = allCategories.find(c => c.id === categoryId);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter(c => c.id !== categoryId)
          : [...prev.categories, category]
      };
    });
  };

  return (
    <div className="form-container">
      <h2>{isEditMode ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Kitap Adı*</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Yayın Yılı*</label>
            <input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Stok*</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Yazar*</label>
          <select value={formData.author.id} onChange={handleAuthorChange} required>
            <option value="0">Yazar Seçin</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>{author.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Yayınevi*</label>
          <select value={formData.publisher.id} onChange={handlePublisherChange} required>
            <option value="0">Yayınevi Seçin</option>
            {publishers.map(publisher => (
              <option key={publisher.id} value={publisher.id}>{publisher.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Kategoriler</label>
          <div className="category-checkboxes">
            {allCategories.map(category => (
              <label key={category.id}>
                <input
                  type="checkbox"
                  checked={formData.categories.some(c => c.id === category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/books')}
            className="cancel-btn">İptal</button>
          <button 
            type="submit"
            className="submit-btn">{isEditMode ? 'Güncelle' : 'Kaydet'}</button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;