import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const BorrowingForm = () => {
  // Form verilerini tutan state
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerMail: '',
    borrowingDate: new Date().toISOString().split('T')[0], // Varsayılan olarak bugünün tarihi
    returnDate: '',
    bookForBorrowingRequest: { id: 0 }  // Kitap ID'si
  });

  const [books, setBooks] = useState([]); // Kitap listesini tuta
  const { id } = useParams(); // URL'den ödünç kaydının ID'sini alır
  const navigate = useNavigate();
  const isEditMode = !!id; // Güncelleme mi yoksa yeni kayıt mı olduğunu belirler

   // Bileşen yüklendiğinde kitapları ve (varsa) mevcut ödünç verisini getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksRes = await api.get('/books'); // Kitap listesini API'den al
        setBooks(booksRes.data);

        // Düzenleme modundaysa mevcut ödünç kaydını getir
        if (isEditMode) {
          const borrowingRes = await api.get(`/borrows/${id}`);
          const data = borrowingRes.data;
          // Gelen verilerle formu doldur
          setFormData({
            borrowerName: data.borrowerName,
            borrowerMail: data.borrowerMail,
            borrowingDate: data.borrowingDate,
            returnDate: data.returnDate || '',
            bookForBorrowingRequest: {
              id: data.book.id,
              name: data.book.name,
              publicationYear: data.book.publicationYear,
              stock: data.book.stock
            }
          });
        }
      } catch (error) {
        toast.error('Veri yükleme hatası');
        console.error(error);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  // Form gönderildiğinde çalışır
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Güncelleme veya yeni ekleme için payload oluştur
      const payload = isEditMode ? {
        borrowerName: formData.borrowerName,
        borrowingDate: formData.borrowingDate,
        returnDate: formData.returnDate
      } : {
        ...formData,
        bookForBorrowingRequest: {
          id: formData.bookForBorrowingRequest.id
        }
      };

      // API isteği gönder (PUT veya POST
      if (isEditMode) {
        await api.put(`/borrows/${id}`, payload);
        toast.success('Ödünç kaydı güncellendi!');
      } else {
        await api.post('/borrows', payload);
        toast.success('Ödünç kaydı eklendi!');
      }
      navigate('/borrowings'); // Liste sayfasına yönlendir
    } catch (error) {
      toast.error(error.response?.data?.message || 'İşlem başarısız');
      console.error(error);
    }
  };

  // Input değiştiğinde form verisini günceller
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Kitap seçimi değiştiğinde form verisini günceller
  const handleBookChange = (e) => {
    const bookId = Number(e.target.value);
    const selectedBook = books.find(b => b.id === bookId) || { id: 0 };
    setFormData(prev => ({
      ...prev,
      bookForBorrowingRequest: selectedBook
    }));
  };

  return (
    <div className="form-container">
      <h2>{isEditMode ? 'Ödünç Kaydı Düzenle' : 'Yeni Ödünç Kaydı'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ödünç Alan Kişi*</label>
          <input
            name="borrowerName"
            value={formData.borrowerName}
            onChange={handleChange}
            required
          />
        </div>

        {!isEditMode && (
          <>
            <div className="form-group">
              <label>Email*</label>
              <input
                type="email"
                name="borrowerMail"
                value={formData.borrowerMail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ödünç Alma Tarihi*</label>
              <input
                type="date"
                name="borrowingDate"
                value={formData.borrowingDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* <div className="form-group">
              <label>İade Tarihi*</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate || ''}
                onChange={handleChange}
                required
              />
            </div> */}

            <div className="form-group">
              <label>Kitap*</label>
              <select
                value={formData.bookForBorrowingRequest.id}
                onChange={handleBookChange}
                required
              >
                <option value="0">Kitap Seçin</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.name} (Stok: {book.stock})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <div className="form-group">
            <label>İade Tarihi*</label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate || ''}
              onChange={handleChange}
              required
            />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/borrowings')}
            className='cancel-btn'>İptal</button>
          <button 
            type="submit"
            className='submit-btn'>{isEditMode ? 'Güncelle' : 'Kaydet'}</button>
        </div>
      </form>
    </div>
  );
};

export default BorrowingForm;