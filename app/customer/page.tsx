'use client';
import { useState, useEffect } from 'react';

export default function RakeenCustomerPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);

  // جلب قائمة العملاء المسجلين عند تحميل الصفحة
  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customer');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error('خطأ في جلب البيانات', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // دالة إرسال وحفظ بيانات العميل الجديد
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, location: address }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('تم تسجيل بياناتك بنجاح! مرحباً بك في منصة ركين.');
        setName('');
        setPhone('');
        setEmail('');
        setAddress('');
        fetchCustomers(); // تحديث القائمة فوراً
      } else {
        setMessage(data.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً.');
      }
    } catch (err) {
      setMessage('حدث خطأ في الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', direction: 'rtl', fontFamily: 'Tahoma, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2563eb' }}>منصة ركين (Rakeen) للوساطة والتسوق</h1>
        <p style={{ color: '#6b7280' }}>سجل بياناتك للبدء في طلب المنتجات من المتاجر العالمية بسهولة وأمان</p>
      </header>

      {/* نموذج التسجيل */}
      <section style={{ background: '#f9fafb', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', color: '#1f2937' }}>تسجيل عميل جديد</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>الاسم الكامل *</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="مثال: محمد أحمد"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>رقم الهاتف (واتساب) *</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              placeholder="مثال: 771081432"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>البريد الإلكتروني (اختياري)</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
           <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                 العنوان / المدينة (اختياري)
                </label>
             <input
             value={address}
               onChange={(e) => setAddress(e.target.value)}
               type="text"
                 placeholder="مثال: اليمن - صنعاء"
                 style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                 />
                </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px', 
              background: loading ? '#9ca3af' : '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'جاري الحفظ...' : 'تسجيل وحفظ البيانات'}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: '15px', padding: '10px', borderRadius: '6px', background: message.includes('نجاح') ? '#d1fae5' : '#fee2e2', color: message.includes('نجاح') ? '#065f46' : '#991b1b', textAlign: 'center' }}>
            {message}
          </div>
        )}
      </section>

      {/* قسم عرض العملاء المسجلين (لأغراض المتابعة والإدارة) */}
      <section>
        <h2>العملاء المسجلون في النظام ({customers.length})</h2>
        <div style={{ overflowX: 'auto', marginTop: '15px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', textAlign: 'right' }}>
                <th style={{ padding: '12px' }}>#</th>
                <th style={{ padding: '12px' }}>الاسم</th>
                <th style={{ padding: '12px' }}>الهاتف</th>
                <th style={{ padding: '12px' }}>العنوان</th>
                <th style={{ padding: '12px' }}>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>لا توجد بيانات مسجلة حتى الآن</td>
                </tr>
              ) : (
                customers.map((c, index) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>{index + 1}</td>
                    <td style={{ padding: '12px' }}>{c.name}</td>
                    <td style={{ padding: '12px' }}>{c.phone}</td>
                    <td style={{ padding: '12px' }}>{c.address || '-'}</td>
                    <td style={{ padding: '12px' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}