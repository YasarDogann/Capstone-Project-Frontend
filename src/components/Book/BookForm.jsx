import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const BookForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    publicationYear: new Date().getFullYear(),
    stock: 0,
    author: { id: 0, name: '', birthDate: '', country: '' },
    publisher: { id: 0, name: '', establishmentYear: 0, address: '' },
    categories: []
  });

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsRes, publishersRes, categoriesRes] = await Promise.all([
          api.get('/authors'),
          api.get('/publishers'),
          api.get('/categories')
        ]);

        setAuthors(authorsRes.data);
        setPublishers(publishersRes.data);
        setAllCategories(categoriesRes.data);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        authorId: formData.author.id,
        publisherId: formData.publisher.id,
        categoryIds: formData.categories.map(c => c.id)
      };

      if (isEditMode) {
        await api.put(`/books/${id}`, payload);
        toast.success('Kitap güncellendi!');
      } else {
        await api.post('/books', payload);
        toast.success('Kitap eklendi!');
      }
      navigate('/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'İşlem başarısız');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthorChange = (e) => {
    const author = authors.find(a => a.id === Number(e.target.value)) || { id: 0 };
    setFormData({ ...formData, author });
  };

  const handlePublisherChange = (e) => {
    const publisher = publishers.find(p => p.id === Number(e.target.value)) || { id: 0 };
    setFormData({ ...formData, publisher });
  };

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
          <button type="button" onClick={() => navigate('/books')}>İptal</button>
          <button type="submit">{isEditMode ? 'Güncelle' : 'Kaydet'}</button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;