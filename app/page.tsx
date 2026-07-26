'use client';
import React, { useState } from 'react';

export default function Home() {
  const [customer, setCustomer] = useState({ name: '', phone: '', location: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const stores = [
    { name: "أمازون (Amazon)", url: "https://www.amazon.com", icon: "📦", desc: "أكبر متجر شامل في العالم" },
    { name: "علي إكسبريس (AliExpress)", url: "https://www.aliexpress.com", icon: "🛒", desc: "منتجات متنوعة وبأسعار اقتصادية" },
    { name: "إي باي (eBay)", url: "https://www.ebay.com", icon: "🏷️", desc: "مزادات ومنتجات جديدة ومستعملة" },
    { name: "شين (SHEIN)", url: "https://www.shein.com", icon: "👗", desc: "أحدث صيحات الموضة والأزياء" },
    { name: "آي هيرب (iHerb)", url: "https://www.iherb.com", icon: "🌿", desc: "المكملات الغذائية والمنتجات الصحية" },
    { name: "نون (Noon)", url: "https://www.noon.com", icon: "⚡", desc: "التسوق السريع في المنطقة" }
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.location) {
      alert('الرجاء إدخال جميع البيانات المطلوبة');
      return;
    }

    setLoading(true);
    try {
      // إرسال البيانات إلى قاعدة البيانات عبر مسار الـ API
      const res = await fetch('/api/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });

      if (res.ok) {
        setIsRegistered(true);
      } else {
        alert('حدث خطأ أثناء حفظ البيانات، حاول مرة أخرى.');
      }
    } catch (error) {
      console.error(error);
      alert('تعذر الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans" dir="rtl">
      <nav className="border-b border-slate-800 px-6 py-4 flex justify-between items-center bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="text-2xl font-black tracking-wider text-amber-500">
          رَكِين <span className="text-xs text-slate-400 block font-normal">منصة طلب ووساطة المتاجر العالمية</span>
        </div>
        {isRegistered && (
          <div className="text-sm bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-300">
            أهلاً بك، <span className="text-amber-500 font-bold">{customer.name}</span> ({customer.location})
          </div>
        )}
      </nav>

      {!isRegistered ? (
        <section className="px-6 py-20 max-w-xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <h1 className="text-3xl font-extrabold mb-2 text-center">مرحباً بك في <span className="text-amber-500">ركين</span></h1>
            <p className="text-slate-400 text-center mb-8 text-sm">الرجاء إدخال بياناتك لحفظها في قاعدة البيانات والبدء بالتسوق</p>
            
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">الاسم الكامل</label>
                <input 
                  type="text" 
                  placeholder="أدخل اسمك الكريم"
                  value={customer.name}
                  onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">رقم الهاتف (واتساب)</label>
                <input 
                  type="text" 
                  placeholder="مثال: 967770000000+"
                  value={customer.phone}
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">الموقع (المدينة / المنطقة)</label>
                <input 
                  type="text" 
                  placeholder="مثال: اليمن، صنعاء"
                  value={customer.location}
                  onChange={(e) => setCustomer({...customer, location: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-xl transition mt-4 shadow-lg shadow-amber-500/10 disabled:opacity-50"
              >
                {loading ? 'جاري الحفظ في قاعدة البيانات...' : 'دخول إلى قائمة المتاجر 🚀'}
              </button>
            </form>
          </div>
        </section>
      ) : (
        <div>
          <section className="px-6 py-12 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              تم حفظ بياناتك بنجاح! اختر متجرك <span className="text-amber-500">وابدأ الطلب</span>
            </h1>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              تصفح المتاجر العالمية أدناه، اختر منتجك، وقم بنسخه لنتمكن من معالجة طلبك بناءً على موقعك المسجل.
            </p>
          </section>

          <section className="px-6 pb-20 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store, index) => (
                <a 
                  key={index} 
                  href={store.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition flex items-center gap-4 group shadow-lg"
                >
                  <div className="text-4xl p-3 bg-slate-950 rounded-xl border border-slate-800 group-hover:scale-110 transition">
                    {store.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition">{store.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{store.desc}</p>
                    <span className="text-xs text-amber-500/80 mt-2 inline-block font-semibold">تصفح المتجر ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}