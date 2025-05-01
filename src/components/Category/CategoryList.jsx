import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kategorileri çek
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Kategoriler yüklenemedi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Kategori silme (SADELEŞTİRİLMİŞ HALİ)
  const handleDelete = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      try {
        const response = await api.delete(`/categories/${id}`);

        if(response.status === 200){
            toast.success('Kategori silindi!');
            fetchCategories(); // Listeyi yenile
        }
      } catch (error) {
        // Backend'in döndüğü hatayı göster
        const errorMsg = error.response?.data?.message || 'Bu kategori silinemez';

        toast.error(errorMsg);

        // eğer kitaplar varsa ekstra bilgi göster
        if(errorMsg.includes('kitap mevcut')){
            toast.info('Önce bu kategoriye ait kitapları silmelisiniz');
        }
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="category-list">
      <h1>Kategori Listesi</h1>
      <Link to="/categories/new" className="add-button">
        + Yeni Kategori
      </Link>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Adı</th>
            <th>Açıklama</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description || '-'}</td>
              <td className="actions">
                <Link to={`/categories/edit/${category.id}`} className="edit-link">
                  Düzenle
                </Link>
                <button 
                  onClick={() => handleDelete(category.id)} 
                  className="delete-btn"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;